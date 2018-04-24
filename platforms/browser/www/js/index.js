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
 var contrincante;
 var texto = $("#texto");
 var listaUsuarios = $("#listaUsuarios");
 var invitar = $("#invitarUsuarios");

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

        $("#salir").hide();
        $("#tablero").hide();
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
         })
        });
    }
};

var escas, padre, hijo, moviendo; 

function tablero(){

        rival = "user2";

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
                    })
                })
               li.append(data.usernames[i]);
               li.append(a);
               listaUsuarios.append(li);
            }
        }
    })
}

function invitaciones(){

    var li = $('<li></li>');

    $.getJSON("http://localhost:8000/api/invitacion/ver?token="+token,function(data) {
        for(var i = 0; i < data.mensaje.length; i++){

            var a1 = $("<a id='"+data.mensaje[i].name+"' href='#'>  Aceptar</a>").click(function(e){

                    $.getJSON("http://localhost:8000/api/invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=1'",function(data) {
                    })

                    rival = e.target.id;
                    $('#tablero').show();
                    tablero();
                })


            var a2 = $("<a id='"+data.mensaje[i].name+"' href='#'>  Rechazar</a>").click(function(e){
                    e.preventDefault();
                    $.getJSON("http://localhost:8000/api/invitacion/responder?token="+token+"&name="+e.target.id+
                                "&respuesta=0'",function(data) {
                    })
                })

            li.append(data.mensaje[i].name);
            li.append(a1);
            li.append(a2);
            invitar.append(li);
        }
    });
}

function juega(T) {
    elementos = document.querySelectorAll("table, table span"); 

        if(moviendo == null && $(this).find("span")){
            padre = $(this); 
            hijo = $(this).html(); 
            for(i=0; elementos[i]; i++) 
                elementos[i].classList.add("mano"); 
            moviendo = this; 

        }else if(moviendo != null){
            let to = {
                fila: $(moviendo).parent().index() + 1,
                columna: $(moviendo).index() + 1
            }

            let from = {
                fila: $(this).parent().index() + 1,
                columna: $(this).index() + 1
            }
            console.log(to)
            $.getJSON("http://localhost:8000/api/tablero/mover?token="+token+"&name="+name+"&toFila="+to.fila+
        "&toColumna="+to.columna+"&fromFila="+from.fila+"&fromColumna="+from.columna,function(data) {

            console.log(moviendo)
            if(this != moviendo){
                $(padre).html("");
            }

            $(this).html(hijo);
            for(i=0; elementos[i]; i++) 
                elementos[i].classList.remove("mano");
            moviendo = null; 
        
        })
    }
}

app.initialize();
