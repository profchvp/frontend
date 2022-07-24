/**
 * *             Incluir Produtos
 * Aula #115 - Cria a página (design)
 * Aula #116 Buscar as Ordens-Pedidos (Chamada na API)
  */
import { canSSRAuth } from "../../utils/canSSRAuth"
import styles from './styles.module.scss';
import Head from 'next/head';
import {Header} from '../../components/Header'
import { FiRefreshCcw } from "react-icons/fi";
import { ModalOrder } from "../../components/ModalOrder";

import { useState } from "react";

/**
 * API -v116
 */
import { setupAPIClient } from "../../services/api";

/**
 * Configurando Modal -v117
 */
import Modal from 'react-modal'


type OrderProps ={
   id:string;
   table:string | number;
   status: boolean;
   daraft: boolean;
   name: string | null;
}
interface HomeProps{
   orders: OrderProps[];
}

/**
 * Configurando Modal -v117 - TIPAR o Modal
 * eport: pois será exportado para o Modal
 */
export type OrderItemProps={
   id:         string;
   amount:     number;
   order_id:   string;
   product_id: string;
   product:{
      id:          string;
      name:        string;
      description: string;
      price:       string; 
      banner:      string;
   }
   order: {
      id:     string;
      table:  string | number;
      status: boolean;
      name:   string | null;
   }
}
 
//................................para receber(orders), vamos tipar
export default function Dashboard({orders}:HomeProps){
   const [orderList,setOrderList] = useState(orders || []) 

   /**
 * Configurando Modal -v117
 */
 const [modalItem,setModalItem]=useState<OrderItemProps[]>() 
 const [modalVisible,setModalVisible]=useState(false);

 /* Fechando Modal -v117
 */
   function handleCloseModal(){
      setModalVisible(false);
   }

   //.....#116(função para aconal Modal)
    /**
    * utilizando Modal -v117
    */
    async function handleOpenModalView(id:string){
      //...v116 alert("Modal: "+id)
      //...v117
      const apiClient = setupAPIClient();
      //lember: passar parãmetros recebidos no parametro da funcao "id"  
      //   (veja no Insomnia: na Query- é passadoo parâmetro Order_id)
      const response = await apiClient.get('/order/detail',{
         params:{
            order_id:id
         }
      });
      setModalItem(response.data);
      setModalVisible(true);

   }
 /**
 * v120 - Fechando pedido
 */
async function handleFinishItem(id:string){
//......alert("Fechar Pedido: "+id)
const apiClient = setupAPIClient();
await apiClient.put('/order/finish',{
   order_id:id,
})
const response =await apiClient.get('order/list');
setOrderList(response.data);
setModalVisible(false); 
}
/**
    * Aula #120-Botao refresh
    */
async function handleRefreshOrders(){
   const apiClient = setupAPIClient();
   const response = await apiClient.get('order/list')
   setOrderList(response.data)
}



 /**
 * Configurando Modal -v117
 */
   Modal.setAppElement('#__next'); //ver F12 e localizar em Elements a DIV principal


   return(
      //......retirado na aula #108
      //......  <div>
      //......      <h1>Bem vindo ao Painel</h1>
      //......  </div>
   /**
    * Aula #108-Criando Header
    */
    <>  
   <Head>
      <title>Painel - Sujeito Pizza</title>
   </Head>
   <div>
      <Header/>

      <main className={styles.container}>
         <div className={styles.containerHeader}>
            <h1>Últimos Pedidos</h1>
            <button onClick={handleRefreshOrders}>
                <FiRefreshCcw color="#3fffa3" size={25}/>
            </button>
         </div>
         <article className={styles.listOrders}>

            {orderList.length===0&&(
               <span className={styles.emptList}>
                  Não há pedido aberto...
               </span>
            )}
            {orderList.map(item=>(
                  <section key={item.id} className={styles.orderItem}>
                  <button onClick={()=>handleOpenModalView(item.id)}>
                    <div className={styles.tag}></div>
                    <span>Mesa {item.table}</span>
                  </button>
                </section>
            ))}
            

         </article>
      </main>

      { modalVisible &&(
         //parametros declarados na "interface ModalOrderprops" de ModalOrder
         <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={handleFinishItem}
         />)  
      }
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
  /**
 * API -v116
 */
const apiClient = setupAPIClient(ctx);
 const response=await apiClient.get('/order/list')
 //console.log(response.data);  

  
  
  return {
      props:{
         orders:response.data
    }}
  })