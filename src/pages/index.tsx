import { useContext, FormEvent,useState } from "react";

import Head from "next/head"
import Image from 'next/image';
import styles from '../../styles/home.module.scss';
import{ toast } from 'react-toastify';

import {Input} from '../components/ui/Input'
import { Button } from "../components/ui/Button";

import { AuthContext } from "../contexts/AuthContext";

import logoImg from '../../public/logo.svg';

import Link from 'next/link';

//tipar propriedade para SSR
//...import { GetServerSideProps } from "next";
import { canSSRGuest } from "../utils/canSSRGuest";

/**
 * 
 * Componente que executa funções para a página 
 */
export default function Home() {

  const{signIn}=useContext(AuthContext)

  /*
  *Tratar eventos da tela
  */
 const[email,setEmail]=useState('');
 const[password,setPassword]=useState('');
 const[loading,setLoading]=useState(false);


  async function handleLogin(event: FormEvent){
      event.preventDefault();

      if (email===''||password===''){
        toast.warning('Usuário/Senha Inválidos')
        //alert("PREENCHA OS DADOS!!!")
        return;
      }

      setLoading(true); //acionar o Spinner

      let data={
        email,
        password
      }
      await signIn(data)

      setLoading(false); //não acionar o Spinner
  }

  return (
    <>
    <Head>
      <title>Sujeito Pizza - Faça Seu Login</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Sujeito Pizzaria"/>
      <div className={styles.login}>
        <form onSubmit={handleLogin}>
        <Input
            placeholder="Digite Seu o e-mail"
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
        />
        <Input
            placeholder="Digite a sua Senha"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
        />
        <Button
        type="submit"
        loading={loading}
       
        >
          Acessar
        </Button>
        </form>
        <Link href="signup">
            <a className={styles.text}>Não Possui uma conta? Cadastre-se</a>
        </Link>
          
      </div>
    </div>
    </>
  )
}
//Criar estrutura SSR-Server Side Rendering
//.......export const getServerSideProps:GetServerSideProps = async (context) =>{
    
    //......console.log("Testando Server Side Props");
    /**
     * aparece somente no Yarn Dev (Não no Browse)
     * Explicando:
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
    //........return {
    //.......    props:{}
    //.......  }

//.....}
//..........vamor recriar tudo...
export const getServerSideProps=canSSRGuest(async(ctx)=>{
  return {
    props:{}
  }
})