//import { useContext } from "react";
import { useState, FormEvent, useContext } from "react";

import Head from "next/head"
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';
import {toast} from 'react-toastify';

import {Input} from '../../components/ui/Input'
import { Button } from "../../components/ui/Button";

import { AuthContext } from "../../contexts/AuthContext";

import logoImg from '../../../public/logo.svg';

import Link from 'next/link';

export default function SignUp() {
  
  const {signUp}=useContext(AuthContext);

  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');

  const[loading,setLoading]=useState(false);
  
  /**
   * funcção chamada no botao do form
   */
  async function handleSignUp(event:FormEvent){
      event.preventDefault();

      if(name===''||email===''||password===''){
        toast.warning('Preencha todos os Campos')
        //alert("Valores invalidos!!!")
        return;
      }
      setLoading(true);

      let data={
        name,
        email,
        password
      }
      await signUp(data);

      setLoading(false);

  }
  //
  return (
    <>
    <Head>
      <title>Faça o Seu Cadastro Agora</title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Sujeito Pizzaria"/>
      <div className={styles.login}>
        <h1>Criando a Sua Conta</h1>
        <form onSubmit={handleSignUp}>
        <Input
            placeholder="Digite Seu o seu Nome"
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
        />    
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
          Cadastrar
        </Button>
        </form>
        <Link href="/">
            <a className={styles.text}>Já Possui uma conta? Faça Login</a>
        </Link>
          
      </div>
    </div>
    </>
  )
}
