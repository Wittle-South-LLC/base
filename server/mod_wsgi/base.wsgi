import os
import sys

os.environ['BASE_CONNECT_STRING'] = "mysql+mysqldb://base:onlyeric@localhost/base?charset=utf8mb4"
os.environ['BASE_SECRET_KEY'] = "b'd41be0ae31dc684d17db3de7a40f9e040e5f909d72d463fa'"
sys.path.append('/Users/eric/Documents/Projects/base/lib/python3.5/site-packages')

from src.server import APP as application
