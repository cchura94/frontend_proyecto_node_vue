<template>
    <h1>Pagina Web</h1>
    <nav>
        <RouterLink to="/">INICIO</RouterLink> |
        <RouterLink to="/about">NOSOTROS</RouterLink> |
        <RouterLink to="/registro">REGISTRARSE</RouterLink> |
        <RouterLink to="/login">INGRESAR</RouterLink> 
      </nav>

      <RouterView />
      
</template>