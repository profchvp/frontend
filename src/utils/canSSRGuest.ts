/**
 * *    Aula #105-Rotas Privadas
 * Função para páginas que so pode ser acessadas por visitantes
 */
import { GetServerSideProps,GetServerSidePropsContext,GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";
//
export function canSSRGuest<P>(fn:GetServerSideProps<P>){
    return async (contexto:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> =>{
        const cookies = parseCookies(contexto); //ver arquivo "AuthContex.tsx"
        //Se tentativa de "entrada" pra Usuário já logado: redirecionar para Página x
        if (cookies['@nextauth.token']){
            //sim, fez login
            return{
                redirect:{
                    destination:'/dashboard',
                    permanent:false,
                }
            }
        }
        return await fn(contexto);
    }
}
