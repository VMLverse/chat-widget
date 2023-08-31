// genesys-script.js
window.messenger_opened = false;

(function (g, e, n, es, ys) {
    g['_genesysJs'] = e;
    g[e] = g[e] || function () {
        (g[e].q = g[e].q || []).push(arguments);
    };
    g[e].t = 1 * new Date();
    g[e].c = es;
    ys = document.createElement('script');
    ys.async = 1;
    ys.src = n;
    ys.charset = 'utf-8';
    document.head.appendChild(ys);
})(window, 'Genesys', 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js', {
    environment: 'use1',
    deploymentId: 'dcabf129-c29c-404d-a592-4d133e5dcbd9'
});
