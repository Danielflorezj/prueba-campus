import { getDataAll,searchDataById,opc } from "../../Apis/customer-api.js";
export class customerLista extends HTMLElement{
    idUsr=0;
    constructor(){
        super();
        this.render();
        this.requestApiGetRecluta();
        this.abrirModal();
        this.putData();
        
    }
    render(){
        this.innerHTML = /* html */`
            <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nro Documento</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Edad</th>
                                    <th>Email</th>
                        
                                </tr>
                                
                            </thead>
                            <tbody id="lista-reclutas">
                                
                                
                            </tbody>
                            
            </table>
            <div class="modal fade " id="putRecluta" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <customer-form></customer-form>
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
        
       
    
        `
    }
    abrirModal =() =>{
        var myModal = document.querySelector('#putRecluta')
        myModal.addEventListener('shown.bs.modal',function(){
            /* myInput.focus() */

        })
    }
    requestApiGetRecluta = () =>{
        getDataAll()
        .then((result)=>{
            this.renderReclutas(result);
        })
    }
    renderReclutas = (reclutas) =>{
        let reclutasHTML = '';
        for (let recluta of reclutas){
            reclutasHTML += this.crearListaReclutasHTML
            (recluta);
        }
        document.getElementById('lista-reclutas').innerHTML = reclutasHTML;
        this.callModal();
        this.putData();
    }
    crearListaReclutasHTML = (reclutas)=>{
        let listarHTML = /* html */`
        <tr>
            <td>${reclutas.id}</td>
            <td>${reclutas.cc}</td>
            <td>${reclutas.nombres}</td>
            <td>${reclutas.apellidos}</td>
            <td>${reclutas.edad}</td>
            <td>${reclutas.email}</td>
            <td>
            <a class="btn btn-success " data-bs-toggle="modal" data-bs-target="#putRecluta" id="putData" data-idcli='${reclutas.id}'><i class='bx bx-edit-alt icono' data-idcli='${reclutas.id}'></i></a>
            <a class="btn btn-danger" data-idclidel='${reclutas.id}'><i class='bx bx-message-alt-x icono'></i></a>
                
            </td>
            </tr>
        
        `;
        return listarHTML;
    }
    callModal = () =>{
        document.querySelectorAll('#putData').forEach((item,id) =>{
            item.addEventListener("click",(e) =>{
                this.idUsr=e.target.dataset.idcli;
                this.requestApiGetReclutaById(e.target.dataset.idcli);
                e.stopImmediatePropagation();
                e.preventDefault();
            })
        })
    }
    requestApiGetReclutaById = (id) =>{
        searchDataById(id)
            .then((result)=>{
                this.loadDataFrm(result);
            })
    }
    loadDataFrm(data){

        const myForm = document.querySelector("#frmData");
        const {createdAt,cc,nombres,apellidos,edad,email,telefono,fechanac,id}= data;
        const frm = new FormData(myForm);
        frm.set("createdAt",createdAt);
        frm.set("cc",cc);
        frm.set("nombres",nombres);
        frm.set("apellidos",apellidos);
        frm.set("edad",edad);
        frm.set("email",email);
        frm.set("telefono",telefono);
        frm.set("fechanac",fechanac);
        frm.set("id",id);

        for (var pair of frm.entries()) {
            myForm.elements[pair[0]].value = pair[1];
        }
    }
    putData = (id) =>{
        let myForm = document.querySelector("#frmData");
        myForm.addEventListener("submit", (e)=>{
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.target));
            opc[e.submitter.dataset.accion](data,this.idUsr);
        })
    }
}
customElements.define("customer-lista",customerLista)