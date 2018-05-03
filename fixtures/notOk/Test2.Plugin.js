"use strict"

module.exports = function() {

    return new Promise( ( resolve, reject ) => {
        setTimeout( function() {
            resolve( {
                foo: "bar",
            } )
        }, 500 )
    } )

}
