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
    }
    
};

 function tablero(){

    var escas, padre, hijo, moviendo; 
    var trebejos0 = ["♖","","","","","","",""];

      escas = document.getElementById("tablero"); 
      for(f=0; f<8; f++) {
        var fila = escas.insertRow(); 

        for(c=0; c<8; c++){
          var celda = fila.insertCell(); 
          if(f==0 && c==0) celda.innerHTML = "<span class=negras>"+trebejos0[c]+"</span>"; 
          else if(f==1) celda.innerHTML = "<span class=>"+"</span>"; 
          else if(f==6) celda.innerHTML = "<span class=blancas>"+"</span>"; 
          else if(f==7) celda.innerHTML = "<span class=blancas>"+"</span>"; 
        }
      }

      var movible = document.querySelectorAll("td"); 
        for(m=0; m<movible.length; m++) {
        movible[m].setAttribute("onclick", "juega(this)", false);
    }

    function juega(T) {

        var elementos = document.querySelectorAll("table, table span"); 

        if(!moviendo && T.firstElementChild){
        padre = T; 
        hijo = T.innerHTML; 

        for(i=0; elementos[i]; i++) elementos[i].classList.add("mano"); 

        T.querySelector("span").style.opacity = ".4"; 

        moviendo = true; 
    }

    else if(moviendo){
        padre.innerHTML = ""; 
        T.innerHTML = hijo; 

    for(i=0; elementos[i]; i++) elementos[i].classList.remove("mano"); 

        moviendo = false; 
    }
    }
}

app.initialize();