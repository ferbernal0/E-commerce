module.exports = {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        client: 'mongodb',
        cnxStr: 'mongodb://localhost:27017/ecommerce'
    },
  file: {
      path: './data'
  },
  
  firestore:{
      "type": "service_account",
      "project_id": "logical-handler-318117",
      "private_key_id": "58c242ca8e5ddb3cdfe7aabb82025b8800033f47",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDReffpb9JhoRn/\nt7BUTtJljWZSp43YZhcKgr6YfF183br3w/Hcl5mHM7/wIibp+legdLxF4IaM4exF\nWn42DXO2gmDUawL90jSduSv7KtDAdSBUNAoBTpbjsEJ2E8W60fKRzumex+VzhD7c\nxInp4JRv+rAmRYa0e61zlvi9mOlQJAgnVXwmG0V5jdurbanWgrEAdnMvp7Dhs8QQ\npq8OVHfwlKM0U1wQl86BKUNeC5JFsax71Qc6QqE9HvykAat6GlThEj11CrqGGIt/\njWYe0vDc8Ssxks5wHA9yyXR/1UyYvIMQmLe76iJoMtUAOYOm5mMivjxYbDwOQYWP\nQNcUMC/zAgMBAAECggEAV4AiwfRvRU/Fq+8fbUAVm8zyWoFZ+3Q9mKrfkZOVe5Sl\nRlynmXUL8RF5UgX6Ck+DredFQ80TdyLiDmBMCykYVjrk1qYytDLLvrx8Nij+1P23\n+ORZ74zT850LTgZZWH3dXPG43ZXzbwrlNVO1piek6ZemX/431Ak7fWapVY1bnBkH\ng78Bhq77UK5mclnCIWFiB3oaCeyvau2uLhGOG+vKJXpGgxNAdQ+aMHSvkOGuO01j\n68yQI9X2fk0S8bndXtrt5M7uXSBJ2j85n+MJq1enPGDXp+hQqftHKzl0XhE4aYQx\nv6tLwudn5XkR9vz1cFqVl78BIB1BqE0h0nPZJYpTMQKBgQDp3iX/ocVpizlj0j3m\njb0jEtDGmQHdcudyHR0zE3nmNc+lnokeSa5dhpMDlFQ1VBu0etF5pp9GTkciSy8r\ngRsmw0X1e7jHZTbxVE3eCGZ/UZ4+QwOe090T4xJ26dWODq/4Rr76MdAnyEMPkYPa\nRGJCLnsk6poHE4QdCi6Vr0+DgwKBgQDlTOXXYz2YyncYZWGZ9+aCepJrYERhfnOV\nWqTIvJQy+njeu0I6q13fpKJqSO5HPAk7fJyhvUULAP0ueDd/w82WUmH3xCRNCZOn\nk+0xFnQM2QdkypzaODzbxWxveg0rIDVi/qhbLLKm+2c6GHxJYoQSt9sKFVku019R\nV2znD3BG0QKBgQCC6OwiTR6hNuK4Ir6tqNefo2+kS4/EswYlVXC734ITwDlsvvKI\nNrxY8/SlQ0lj1KHxg/JwAzoS88xTwPw1gP5+0z387PWBAAIiUouH5vHhAQHwXjjP\nlk6hTDFQyRHWhBgyhP9wM6QOMMaBF3ZUHoVWAIjEIGJ55Y3FZ6at+UUsGwKBgQDa\nLmRYoOZgdu4BeZ34GijsqGKf5xbJyb+DMp+vHbjKFQhjrryjBKIrBgVAqqqHf3mt\nb7G+OFD02nkN+Xedi5sYWMU9MxXzc5RalOfRmHLOMsfVQPEktvQ5jc3S+MiE633A\n910MfCh1uKuNXPUOAr527RhvrMaSRq/gvxYxecA0sQKBgCMTqe7X4tXGWOdpTU0T\nkt9ULuX0ICP2sd/ANXZXKeIQcHEAeR4bBYfF/sMAOODVXpnOccuLoTUlTtMXkG1l\nka6tzTxnJQeG5XaZFqUKTk/Fgofw6jReWjds8juFjcJbGoS8yWpP+phuLFFCmp5g\nVhnWTYC8vJ9dZq6yDMV8rlLo\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-j5bs1@logical-handler-318117.iam.gserviceaccount.com",
      "client_id": "109623011332601645005",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-j5bs1%40logical-handler-318117.iam.gserviceaccount.com"
}
}
