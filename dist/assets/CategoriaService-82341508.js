import{h as a}from"./index-8262ac01.js";const i={listarCategoria(){return a().get("/categoria")},guardarCategoria(r){return a().post("/categoria",r)},mostrarCategoria(r){return a().get(`/categoria/${r}`)},modificarCategoria(r,t){return a().put(`/categoria/${r}`,t)},eliminarCategoria(r){return a().delete(`/categoria/${r}`)}};export{i as C};
