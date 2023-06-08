import{C as d}from"./CategoriaService-82341508.js";import{_ as y,r as _,d as D,e as u,o as g,c as C,w as b,v,b as a,a as n,f,F as p,g as x,t as m}from"./index-8262ac01.js";const E={setup(){const s=_([]),e=_({nombre:"",detalle:""});D(()=>{i()});const i=async()=>{const{data:l}=await d.listarCategoria();s.value=l};return{categorias:s,categoria:e,guardarCategoria:async()=>{e.value.id?await d.modificarCategoria(e.value.id,e.value):await d.guardarCategoria(e.value),i(),e.value={nombre:"",detalle:""}},editarCategoria:l=>{e.value=l},clearCategoria:()=>{e.value={nombre:"",detalle:""}},eliminarCategoria:async l=>{confirm("¿Está seguro de eliminar la categoria?")&&await d.eliminarCategoria(l.id),i()}}}},B=a("h1",null,"Categoria",-1),L=a("label",{for:"nombre"},"Nombre:",-1),N=a("br",null,null,-1),M=a("br",null,null,-1),T=a("label",{for:"detalle"},"Detalle:",-1),V=a("br",null,null,-1),A=a("br",null,null,-1),I=["value"],O={border:"1"},F=a("tr",null,[a("td",null,"ID"),a("td",null,"NOMBRE"),a("td",null,"DETALLE"),a("td",null,"ACCION")],-1),R=["onClick"],S=["onClick"];function U(s,e,i,o,h,k){const r=u("Column"),l=u("Button"),w=u("DataTable");return g(),C(p,null,[B,L,N,b(a("input",{type:"text",id:"nombre","onUpdate:modelValue":e[0]||(e[0]=t=>o.categoria.nombre=t)},null,512),[[v,o.categoria.nombre]]),M,T,V,b(a("textarea",{id:"detalle",rows:"3",cols:"30","onUpdate:modelValue":e[1]||(e[1]=t=>o.categoria.detalle=t)},null,512),[[v,o.categoria.detalle]]),A,a("input",{type:"button",value:o.categoria.id?"Modificar Categoria":"Guardar Categoria",onClick:e[2]||(e[2]=(...t)=>o.guardarCategoria&&o.guardarCategoria(...t))},null,8,I),a("button",{onClick:e[3]||(e[3]=t=>o.clearCategoria())},"cancelar"),n(w,{value:o.categorias,responsiveLayout:"scroll"},{default:f(()=>[n(r,{field:"id",header:"ID"}),n(r,{field:"nombre",header:"NOMBRE"}),n(r,{field:"detalle",header:"DETALLE"}),n(r,{exportable:!1,style:{"min-width":"8rem"}},{body:f(t=>[n(l,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:c=>o.editarCategoria(t.data)},null,8,["onClick"]),n(l,{icon:"pi pi-trash",class:"p-button-rounded p-button-warning",onClick:c=>o.eliminarCategoria(t.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value"]),a("table",O,[F,(g(!0),C(p,null,x(o.categorias,t=>(g(),C("tr",{key:t.id},[a("td",null,m(t.id),1),a("td",null,m(t.nombre),1),a("td",null,m(t.detalle),1),a("td",null,[a("button",{onClick:c=>o.editarCategoria(t)},"editar",8,R),a("button",{onClick:c=>o.eliminarCategoria(t)},"eliminar",8,S)])]))),128))])],64)}const q=y(E,[["render",U]]);export{q as default};
