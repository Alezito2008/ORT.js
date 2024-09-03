require('dotenv').config()

let cookies;

async function iniciarSesion(dni, contraseña) {
    const params = new URLSearchParams()
    params.append('u', dni)
    params.append('c', contraseña)

    const respuesta = await fetch('https://campus.ort.edu.ar/ajaxactions/LogearUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: params.toString()
    })

    const data = await respuesta.json()

    const logeado = !data.tit

    const cookie = respuesta.headers.get('set-cookie')
        .split(', ')[1]
        .split(';')[0]
    cookies = cookie
    console.log(cookie)
}

async function buscarUsuario(query) {
    const params = new URLSearchParams()
    params.append('method', 'GetAmigosForAutocomplete')
    params.append('q', query)

    const respuesta = await fetch('https://campus.ort.edu.ar/amigos/ajax/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': cookies
        },
        body: params.toString()
    })

    const data = await respuesta.json()
    return data[0]
}

async function enviarMensaje(to, msg) {
    const params = new URLSearchParams()
    params.append('method', 'SendMessage')
    params.append('to', to)
    params.append('msg', msg)

    const respuesta = await fetch('https://campus.ort.edu.ar/amigos/ajax/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': cookies
        },
        body: params.toString()
    })
    const data = await respuesta.json()

    return data
}

async function obtenerURLMensaje(idUsuario) {
    const params = new URLSearchParams()
    params.append('idUsuario', idUsuario)

    const respuesta = await fetch('https://campus.ort.edu.ar/ajaxactions/IrAMensaje', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': cookies
        },
        body: params.toString()
    })

    return await respuesta.text()
}

async function main() {
    await iniciarSesion(process.env.DNI, process.env.PASSWORD)
    const usuario = await(buscarUsuario('49009206'))
    const mensaje = await enviarMensaje(usuario.id, 'Manzana')
}

main()
