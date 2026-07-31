# -*- coding: utf-8 -*-
"""Serveur HTTPS local pour previsualiser le site (iframe Reservio incluse).

Reservio renvoie "Content-Security-Policy: frame-ancestors https:" :
l'iframe de reservation reste blanche en file:// et en http://localhost.
Ce serveur fournit la vraie origine https:// exigee par le navigateur.

Fichier de TEST uniquement — ne pas deployer.
Lance automatiquement par _preview-local.bat.
"""
import datetime
import functools
import http.server
import ipaddress
import os
import ssl
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
CERT = os.path.join(ROOT, '_preview-cert.pem')
PORT = 8443


def make_cert():
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
    except ImportError:
        print("Module manquant. Lancez d'abord :  python -m pip install cryptography")
        input('Entree pour fermer...')
        sys.exit(1)

    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'localhost')])
    now = datetime.datetime.now(datetime.timezone.utc)
    cert = (x509.CertificateBuilder()
            .subject_name(name).issuer_name(name)
            .public_key(key.public_key())
            .serial_number(x509.random_serial_number())
            .not_valid_before(now - datetime.timedelta(days=1))
            .not_valid_after(now + datetime.timedelta(days=365))
            .add_extension(x509.SubjectAlternativeName([
                x509.DNSName('localhost'),
                x509.IPAddress(ipaddress.ip_address('127.0.0.1'))]), critical=False)
            .sign(key, hashes.SHA256()))
    with open(CERT, 'wb') as fh:
        fh.write(cert.public_bytes(serialization.Encoding.PEM))
        fh.write(key.private_bytes(serialization.Encoding.PEM,
                                   serialization.PrivateFormat.TraditionalOpenSSL,
                                   serialization.NoEncryption()))


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # console silencieuse


if not os.path.exists(CERT):
    print('Generation du certificat local...')
    make_cert()

handler = functools.partial(Handler, directory=ROOT)
try:
    httpd = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler)
except OSError:
    print(f'Le port {PORT} est deja utilise — le serveur tourne probablement deja.')
    sys.exit(0)

ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(CERT)
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)

print(f'Serveur pret : https://localhost:{PORT}/index.html')
print('Laissez cette fenetre ouverte pendant la previsualisation.')
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
