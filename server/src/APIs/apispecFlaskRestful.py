"""apispecFlaskRestful.py - Plugin to handle paths for Flask Restful endpoints"""
from apispec import Path
from apispec import utils

def resource_path_helper(spec, path, resource):
    """Provides path when given a FlaskRestful resource"""
    operations = utils.load_operations_from_docstring(resource.__doc__)
    return Path(path=path, operations=operations)

def setup(spec):
    """Adds in helper"""
    spec.register_path_helper(resource_path_helper)
