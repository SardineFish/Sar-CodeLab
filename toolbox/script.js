const libs = {
    "crypto-js": "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js",
    "openpgp": "https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.6.2/openpgp.min.js",
}

function load(lib)
{
    const element = document.createElement("script");
    element.onload = () =>
    {
        console.log(`'${lib}' loaded.`);
    }

    if (libs[lib])
    {
        console.log(`Loading lib '${lib}' from ${libs[lib]}`);
        element.src = libs[lib];
    }
    else
    {
        console.log(`Loading lib from ${lib}`);
        element.src = lib;
    }

    document.body.appendChild(element);
}