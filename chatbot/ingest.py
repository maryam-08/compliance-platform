import os
from dotenv import load_dotenv
from supabase import create_client
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
import pytesseract
import os
import pytesseract
# 1. Define the path (Double-check this path in your File Explorer!)
tess_path = r'C:\Program Files (x86)\Tesseract-OCR'

tess_exe = os.path.join(tess_path, 'tesseract.exe')
import os
# This path leads to the folder where 'pdftoppm.exe' and other tools live
os.environ["PATH"] += os.pathsep + r'C:\Users\LOQ\Downloads\Release-25.12.0-0\poppler-25.12.0\Library\bin'
os.environ["TESSDATA_PREFIX"] = r'C:\Program Files (x86)\Tesseract-OCR\tessdata'
# 2. Tell the pytesseract wrapper
pytesseract.pytesseract.tesseract_cmd = tess_exe

# 3. Tell the System Environment (This is what 'unstructured' looks at)
os.environ["PATH"] += os.pathsep + tess_path

# 4. Tell Tesseract where its language data (tessdata) is
os.environ["TESSDATA_PREFIX"] = tess_path


# --- 1. SETUP & CONFIGURATION ---
load_dotenv() # Reads your .env file

# Get variables from .env
PROJECT_ID = os.getenv("PROJECT_ID")
SUPABASE_URL = f"https://{PROJECT_ID}.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BUCKET_NAME = "legal_docs"

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize the Embedding Model (Free/Local)
embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Initialize the Text Splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, 
    chunk_overlap=100
)

# Paths
DATA_PATH = "./data/"
# This matches the Supabase Public URL format
BASE_STORAGE_URL = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/"

# --- 2. PROCESS FOLDER ---
if not os.path.exists(DATA_PATH):
    print(f"❌ Error: Folder {DATA_PATH} not found!")
else:
    for filename in os.listdir(DATA_PATH):
        if filename.endswith(".pdf"):
            file_path = os.path.join(DATA_PATH, filename)
            
            # --- STEP A: Generate the Link to the Bucket ---
            # This creates the URL that points to the file already in your bucket
            public_url = BASE_STORAGE_URL + filename
            
            print(f"Reading: {filename}...")
            
            # --- STEP B: Load and Metadata (OCR Version) ---
            # 'strategy="ocr_only"' forces the code to look at the image and extract text
            loader = UnstructuredPDFLoader(file_path, strategy="ocr_only",languages=["fra", "eng"])
            pages = loader.load()
            
            # Attach the URL and filename to every page's metadata
            for page in pages:
                page.metadata["source_url"] = public_url
                page.metadata["file_name"] = filename
            
            # --- STEP C: Chunk and Upload ---
            chunks = text_splitter.split_documents(pages)
            
            print(f"Pushing {len(chunks)} chunks to Supabase...")
            
            SupabaseVectorStore.from_documents(
                chunks,
                embeddings_model,
                client=supabase,
                table_name="doc_chunks",
                query_name="match_documents"
            )
            print(f"✅ Successfully indexed: {filename}")