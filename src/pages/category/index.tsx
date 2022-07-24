/**
 * *             Incluir Categoria de Produtos
 * Aula #109 - Cria a página (design)
 * Aula #110 - Chamar a rota (chamar a API:Requisição http)
 */
import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from 'next/head';
import {Header} from '../../components/Header'
import styles from './styles.module.scss';

import { useState, FormEvent } from "react";

//libs para trabalhar com API
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

export default function Category(){
  const [name,setName]=useState('');
  //função acionada quando botao for clicado(associar no evento "onSubmit")
  async function handleRegister(event:FormEvent) {
    event.preventDefault(); //para não atualizar com F5
    //alert("Categoria: "+name);
    if (name===''){
      return;
    }
    //fazer a requisição http:
    const apiClient = setupAPIClient();
    await apiClient.post('category',{
        name: name //(recebido no useState)
    })
    toast.success("Categoria cadastrada com Sucesso!!!");
    setName('');//limpa o nome na tela
  }
    return(
      //......retirado na aula #109
      //......  <div>
      //......      <h1>Bem vindo ao Painel</h1>
      //......  </div>
   /**
    * Aula #109-Criando Header
    */
    <>  
    <Head>
        <title>Nova Categoria - Sujeito Pizzaria</title>
    </Head>
    <div>
    <Header/>
    <main className={styles.container}>
      <h1>Cadastar Categorias</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Digite o nome da categoria"
          className={styles.input}
          value={name}
          onChange={(e)=>setName(e.target.value)} 
         />
         <button className={styles.buttonAdd} type="submit">
          Cadastar
         </button>
          
      </form>
    </main>
    </div>
    </>
   )
}
    
//Criar estrutura SSR-Server Side Rendering
    /**
    * primeiro é executado SSR, depois renderiza a tela, ou seja,
     * antes de aparecer a tela para o cliente, podemos fazer um acesso a API,
     * verificar BD/Kookies, etc e depois disponibilizar os dados para o 
     * component e"Home()"
     * 
     * Importante: Ao inves de fazer toda verificação aqui 
     * (Verificar kookie, se etá logado, etc) faremos em um arquivo para reutiliaar em 
     * outras páginas tb.
     *  
     * src/utils/canSSRGuest.ts (Uarios não logados acessar)
     * src/utils/canSSRAuth.ts (Uarios logados acessar)
     *  */ 
    

//.....}
//..........vamor recriar tudo...
export const getServerSideProps=canSSRAuth(async(ctx)=>{
    return {
      props:{}
    }
  })