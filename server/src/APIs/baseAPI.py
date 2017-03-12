"""baseAPI.py - Creates a shared specification object for Swagger / OpenAPI 2.0 specification"""
from apispec import APISpec

# Create the API APISpec
BASE_SPEC = APISpec(
    title='Wittle South LLC Base Project - API Specification',
    version='1.0.0',
    info=dict(
        description='API Specification for base project APIs'
    ),
    plugins=['apispec.ext.marshmallow', 'src.APIs.apispecFlaskRestful']
)

BASE_SPEC.definition('SuccessResponse', properties={
    'success': {'type': 'boolean'},
    'msg': {'type': 'string'},
    'id': {'type': 'integer'}
})

BASE_SPEC.definition('ReferenceLinks', properties={
    'relationship': {'type': 'string'},
    'uri': {'type': 'string'}
})
