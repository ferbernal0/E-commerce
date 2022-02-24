import config from '../config.js'

const configFb = {
    "type": config.fb.typeAccount,
    "project_id": config.fb.projectId,
    "private_key_id": config.fb.privateKeyId,
    "private_key": config.fb.privateKey,
    "client_email": config.fb.clientEmail,
    "client_id": config.fb.clientId,
    "auth_uri": config.fb.authUri,
    "token_uri": config.fb.tokenUri,
    "auth_provider_x509_cert_url": config.fb.authProviderCertUri,
    "client_x509_cert_url": config.fb.clientCertUri,
}  

export default configFb