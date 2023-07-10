from flask import Flask
from flask_restx import Api
from .auth.views import auth_namespace
from .account.views import account_namespace
from .config.config import config_dict
from .utils import db
from .models.user import User
from .models.account import Account
from .models.loan import Loan
from .models.transaction import CreditTransaction
from flask_migrate import Migrate
#from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.exceptions import NotFound, MethodNotAllowed

def create_app(config=config_dict['prod']):
    app = Flask(__name__)
    app.config.from_object(config)
    #CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)
    migrate = Migrate(app, db)
    authorizations = {
        "Bearer Auth": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Add a JWT token to the header with Bearer &lt;JWT&gt; token to authorize **"
        }
    }
    api = Api(app,
              title="BANKING SYSTEM API",
              description="A simple banking system API",
              authorizations=authorizations,
              security='Bearer Auth'
              )
    api.add_namespace(auth_namespace, path='/auth')
    api.add_namespace(account_namespace, path='/account')
    
    @api.errorhandler(NotFound)
    def not_found(error):
        return {"error": "Not Found"}, 404
    
    @api.errorhandler(MethodNotAllowed)
    def method_not_allowed(error):
        return {"error": "Message Not Allowed"}, 405

    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db,
            'user': User,
            'account': Account,
            'loan': Loan,
            'credittransaction': CreditTransaction,
        }

    with app.app_context():
        db.create_all()

    return app