import {createContext,ReactNode,useState,useEffect} from 'react';
import {destroyCookie, setCookie,parseCookies} from 'nookies';
import Router from 'next/router';
import {api} from '../services/apiClients';

import {toast} from 'react-toastify';
//
type AuthContextData={
    user:UserProps;
    isAuthenticated:boolean;
    signIn:(credencials:SignInProps) => Promise<void>;
    signOut:() => void;
    signUp:(credencials:SignUpProps) =>Promise<void>;
}
type UserProps={
    id:string;
    name:string;
    email:string;
}
type SignInProps={
    email:string;
    password:string,
}
type AuthProviderProps={
    children:ReactNode;
}
//tipagem para receber dados do SIGNUP
type SignUpProps = {
    name:string;
    email:string;
    password:string;
}
//
export const AuthContext = createContext({} as AuthContextData)

/*
*  função para deslogar usuario
*/
export function signOut(){
    try{
        //limpar o token 
        //está dentro do arquivo "api.ts"
        destroyCookie(undefined,'@nextauth.token')
        Router.push('/')  //manda para rota de LOGIN
    }catch{
        console.log("erro ao deslogar")
    }

}


export function AuthProvider({children}:AuthProviderProps){
    const [user,setUser]=useState<UserProps>()
    const isAuthenticated= !!user;
    /**
     * Aula #107-Permanecendo Login
     * sempre permacer com dados do usuario durante a navegação, e mesmo depois
     * que o Bowser for fechado
     * Importar tb "useEffect" para ter ciclo de vida (Sempre que o componente for carregado)
     */
    useEffect(()=>{
        //....alert("Componente carregado")
        //tentar pegar algo no cookie
        const {'@nextauth.token':token}=parseCookies();
        if (token){
            api.get('/me').then(response=>{
                //receber os dados do usuario
                const  {id, name, email}=response.data;
                setUser({
                    id,
                    name,
                    email
                })
            })
            //se entrar no catch: tentou fazer a requisição, 
            //porem não funciou(Token ivalido/adulterado,expirou)
            .catch(()=>{
                //deslogar o useuario(USER)
                signOut();
            })
              
              
        }
      },[])


    async function signIn({email,password}:SignInProps){
        //alert("Clicou no Login")
        //console.log("Dados..."+email+"..."+password)
        try{
            const response =await api.post('/session',{
                email,
                password
            })
            //console.log(response.data);
            const {id,name,token}=response.data;
            setCookie(undefined,'@nextauth.token',token,{
                maxAge:60 * 60 * 24 * 30, //expirar em 1 mês
                path:'/' //quais caminhos terão acesso ao cookie
            })
            setUser({
                id,
                name,
                email,
            })
            //passar para próximas requisições o token
            api.defaults.headers['Authorization']=`Bearer ${token}`
            //
            //redirecionar o user para /dashboard (página dos últimos pedidos)
            toast.success('Bem vindo ao Sistema!!!')
            Router.push('/dashboard')
        }catch(err){
            //console.log("ERRO AO ACESSAR",err)
            toast.error('Usuário/Senha Inválidos')
        }
    }
    /**
     * Funcção de SIGNUP
     */
    async function signUp({name,email,password}:SignUpProps) {
        //console.log(name);
        try{
            const response = await api.post('/users',{
                name,
                email,
                password
            })
            //console.log('CADASTRADO COM SUCESSO!!!');
            toast.success('Cadstrado com Sucesso!!!')
            //levar para a pagina de login (força o login)
            Router.push('/');
        }catch(err){
            toast.error('Erro ao Cadstrar')
            //console.log("Erro ao cadastrar",err);
        }
    }
    //
    //
    return(
        <AuthContext.Provider value={{user ,isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}