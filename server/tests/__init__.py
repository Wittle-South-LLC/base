"""__init__.py - Initialize test data"""
import os.path
import logging
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
# Import the shared ORM base
from src.DataModel.base import Base
# Import user tables
from src.DataModel.User import User

# Get the connect string from the environment
connect_string = os.environ['BASE_CONNECT_STRING']
assert connect_string is not None

# Create a logger
logger = logging.getLogger()

# Instantiate a database sessions
engine = create_engine(connect_string)
# Bind the ORM data model to the session
DBSession = sessionmaker(bind=engine)

# Delete all of the tables if they exist, then recreate them and
# populate the baseline data
def setup_package():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    setup_data()

# This will be called after the database has been recreated, should
# populate the newly empty database with test data
def setup_data():
    # We are going to use a single database session to create initial data
    session = DBSession()

    # Create a testing user, with a testing password, and save it
    u1 = User(username='testing')
    u1.hash_password('testing')
    session.add(u1)
    session.commit()
