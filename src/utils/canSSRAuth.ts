/**
 *    Aula #106-Rotas Privadas pt2
 * Função para páginas que so pode ser acessadas user LOGADO
 */
 import { GetServerSideProps,GetServerSidePropsContext,GetServerSidePropsResult } from "next";
 import { parseCookies, destroyCookie } from "nookies";
 import { AuthTokenError } from "../services/errors/AuthTokenError";
 //
 export function canSSRAuth<P>(fn:GetServerSideProps<P>){
    return async (contexto:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>>=>{
        const cookies = parseCookies(contexto); //ver arquivo "AuthContex.tsx"
        const token=cookies['@nextauth.token'];
        //Se tentativa de "entrada" pra Usuário já NÃO logado: redirecionar para Página x
        if (!token){
            return{
                redirect:{
                    destination:'/', //redireciona para login
                    permanent:false,
                }
            }
        }
        //pode acessar a página(tem token)
        try{
            return await fn(contexto);
        }catch(err){
            if (err instanceof AuthTokenError){
                destroyCookie(contexto,'@nextauth.token')
                return {
                    redirect:{
                        destination:'/', //volta para login
                        permanent:false
                    }
                }
            }

        }

    }
 }
