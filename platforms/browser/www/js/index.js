/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var token;
 var rival;
 var texto = $("#texto");
 var listaUsuarios = $("#listaUsuarios");
 var invitar = $("#invitarUsuarios");
 var escas, padre, hijo, moviendo; 
 var idIntervalInvitar = null;
 var idIntervalInvitar2 = null;

 var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        tablero();
        $("#tablero").hide();

        $("#salir").hide();
        $("form").submit(function(e){
            e.preventDefault();
            var email = $(this).find("input[name='email']").val();
            var password = $(this).find("input[name='password']").val();

            $.getJSON("http://localhost:8000/api/usuarios/login?email="+email+"&password="+password,function(data) {
                if(data.mensaje == "Session Iniciada"){
                    texto.text(data.mensaje);
                    token = data.token;
                    listaUsuarios.empty();
                    conectado();
                    $("#entrar").hide();
                    $("#salir").show();
                    idIntervalInvitar = setInterval(invitaciones, 1000);
                    idIntervalInvitar2 = setInterval(conectado, 1000);
                }else{
                    texto.text(data.mensaje);
               }
           });
        });

        $('#boton2').click(function(e){
            e.preventDefault();
            $.getJSON("http://localhost:8000/api/usuarios/logout?token="+token,function(data) {
             texto.text(data.mensaje);
             listaUsuarios.empty();
             $("#entrar").show();
             $("#salir").hide();
             $("#tablero").hide();
             clearInterval(idIntervalInvitar);
             clearInterval(idIntervalInvitar2);
         })
        });
    }
};

function tablero(){

        $.getJSON("http://localhost:8000/api/tablero/ver?token="+token+"&name="+rival,function(data) {

        var trebejos0 = ["♖","","","","","","","♖"];

        var div = document.createElement("div"); 
        div.setAttribute("id","sombra"); 
        document.body.appendChild(div); 
        copia = document.getElementById("sombra"); 

        escas = document.getElementById("tablero"); 
        for(f=0; f<8; f++) {
            var fila = escas.insertRow(); 

            for(c=0; c<8; c++){
              var celda = fila.insertCell(); 
              if(f==0 && c==0) celda.innerHTML = "<span class=negras>"+trebejos0[c]+"</span>"; 
              else if(f==1) celda.innerHTML = "<span class=>"+"</span>"; 
              else if(f==6) celda.innerHTML = "<span class=>"+"</span>"; 
              else if(f==7 && c==7) celda.innerHTML = "<span class=blancas>"+trebejos0[c]+"</span>"; 
          }
      }

      var movible = document.querySelectorAll("td"); 
      for(m=0; m<movible.length; m++) {
        $(movible[m]).click(juega);
    }
    });
}

function conectado(){
    var li = $('<li></li>');

    $.getJSON("http://localhost:8000/api/usuarios/verConectados?token="+token,function(data) {
        listaUsuarios.append()
        if(data.usernames === undefined){
            listaUsuarios.text(data.mensaje);
        }
        else{
            for(var i = 0; i < data.usernames.length; i++){
               var a = $("<a id='"+data.usernames[i]+"' href='#'>   Invitar</a>").click(function(e){
                    e.preventDefault();
                    $.getJSON("http://localhost:8000/api/invitacion/invitar?token="+token+"&name="+e.target.id,function(data) {
                    console.log(data.mensaje);
                    rival = e.target.id;
                    tablero();
                    })
                })
               li.append(data.usernames[i]);
               li.append(a);
               listaUsuarios.append(li);
               clearInterval(idIntervalInvitar2);
               $("#tablero").show();
            }
        }
    })
}

function invitaciones(){

    var li = $('<li></li>');

    $.getJSON("http://localhost:8000/api/invitacion/ver?token="+token,function(data) {
        for(var i = 0; i < data.mensaje.length; i++){
            clearInterval(idIntervalInvitar);

            var a1 = $("<a id='"+data.mensaje[i].name+"' href='#'>  Aceptar</a>").click(function(e){

                    $.getJSON("http://localhost:8000/api/invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=1'",function(data) {
                                    li.remove();

                    })

                    rival = e.target.id;
                    tablero();
                })


            var a2 = $("<a id='"+data.mensaje[i].name+"' href='#'>  Rechazar</a>").click(function(e){
                    e.preventDefault();
                    $.getJSON("http://localhost:8000/api/invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=0'",function(data) {
                                    li.remove();
                    })
                })

            li.append(data.mensaje[i].name);
            li.append(a1);
            li.append(a2);
            invitar.append(li);
            $("#tablero").show();
        }
    });
}

function juega(T) {

        let tablero = $("#tablero");
        let ficha = $(this).find("span");

        if(moviendo == null && ficha.length > 0){
            tablero.find("td, span").addClass("mano");
            ficha.css("opacity", "0.4")

            moviendo = this;

        }else if(moviendo){
            let target = this;
            tablero.find("td, span").removeClass("mano");

            let to = {
                fila: $(moviendo).parent().index() + 1,
                columna: $(moviendo).index() + 1
            }

            let from = {
                fila: $(this).parent().index() + 1,
                columna: $(this).index() + 1
            }

            $.getJSON("http://localhost:8000/api/tablero/mover?token="+token+"&name="+rival+"&toFila="+to.fila+
        "&toColumna="+to.columna+"&fromFila="+from.fila+"&fromColumna="+from.columna, function(data) {
            switch(data.mensaje){
                case "ficha movida.":
                    $(moviendo).find("span").css("opacity", "1");
                    $(target).append($(moviendo).children());
                    moviendo = null;
                    break
                default:
                    $(moviendo).find("span").css("opacity", "1");
                    moviendo = null;
                break;
            }
            console.log(data)
            console.log(target);
            console.log(moviendo);
            /*if(target != moviendo){
                $(target).children().remove();
                $(moviendo).children().remove();
                $(target).find("span").css("opacity", "1");

                moviendo = null;
            }*/
        })  .fail(function(data) {
            console.log( data );
        })
    }
}

app.initialize();
