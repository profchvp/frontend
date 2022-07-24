/**
 * *             Incluir Produtos
 * Aula #111 - Cria a página (design)
 * Aula #112 - Componente preview - Enviar Foto-Criamos label no form
 *             para "esconder" o objeto
 * Aula #113 Buscar as categorias (Chamada na API)
 * Aula #114 - Chamar a rota (chamar a API:Requisição http)
 */
 import { canSSRAuth } from "../../utils/canSSRAuth"
 import Head from 'next/head';
 import {Header} from '../../components/Header'
 import styles from './styles.module.scss';
 
 import { useState, FormEvent, ChangeEvent } from "react";
 
 //libs para trabalhar com API - Aula #13
 import { setupAPIClient } from "../../services/api";
 import { toast } from "react-toastify";

 import { FiUpload} from 'react-icons/fi'
 
 /**    v113
  * Como se trata de typescript - vamos tipar
  */
    type Itemprops={
      id:string;
      name:string;
    }
    interface CategoryProps{
      categoryList:Itemprops[];  //array de [id;name]
    }

 //......v113 - receber os dados em "categoryList" que veio da API
 export default function Product({categoryList}:CategoryProps){


  //versao v113
  //console.log(categoryList); 

   const [avatarUrl,setAvatarUrl]=useState('');
   const [imageAvatar,setImageAvatar]=useState(null);

  /**
   *   v113
   * recebemos dentro da propriedade {categoryList}:CategoryProps;
   * vamos colocar em uma useState. 
   * OBS> Se não vir nenhuma categoria, sera colocado no useState um [vazio] 
   */ 
  const [categories,setCategories]=useState(categoryList||[])
  const [categorySelected,setCategoryselected]=useState(0);

  /**
   *    v114
   * Tatar os dados da tela;
   * vamos criar useState para armazenar os dados digitados
   */ 
   const [name, setName]=useState('');
   const [price, setprice]=useState('');
   const [description, setDescription]=useState('');


   function handleFile(evento:ChangeEvent<HTMLInputElement>){
      //console.log(evento.target.files)
      if(!evento.target.files) //não enviou nada
        {
          return;
        }
      const image=evento.target.files[0];
      if(!image)
      {
        return;
      }
      if(image.type==='image/png'||image.type==='image/jpeg'){
        setImageAvatar(image);
        //....aqui mostra a imagem na tela para o usuario ver
        setAvatarUrl(URL.createObjectURL(evento.target.files[0]));
      }
   }
   /**
    * ===v113
    * funcão para selecionar uma categorya do <option> 
    */
    function handleChangeCategory(evento){
        //console.log("Pos. da Cat selecionada:", evento.target.value);
        //console.log("Cat selecionada:", categories[evento.target.value]);
        setCategoryselected(evento.target.value);

    }
    /**
    * ===v114
    * função acionada quando botao for clicado(associar no evento "onSubmit")
    */
       async function handleRegister(event:FormEvent) {
     event.preventDefault(); //para não atualizar com F5
    try{
      const data=new FormData();
      if (name===""||price===""||description===""||imageAvatar===null){
        toast.error("Preencha todos os Campos")
        return;
      }
      //passar o nome do campos esperado no API+Nome usado na useState
      data.append('name',name);
      data.append('price',price);
      data.append('description',description);
      data.append('category_id',categories[categorySelected].id);
      data.append('file',imageAvatar);
      const apiClient = setupAPIClient();
      await apiClient.post('/product',data);

      toast.success("Produto Cadastado com Sucesso!!!");

      //limpar a tela
      setName('');
      setprice('');
      setDescription('');
      setImageAvatar(null);
      setAvatarUrl('');

    }catch(error){
      console.log("error");
      toast.error("Ops...erro ao cadastar");
    }

     
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
         <title>Cadastrar Produtos - Sujeito Pizzaria</title>
     </Head>
     <div>
     <Header/>
     <main className={styles.container}>
       <h1>Cadastar Produtos</h1>
       <form className={styles.form} onSubmit={handleRegister}>
        <label className={styles.labelAvatar}>
          <span>
              <FiUpload size={30} color="#fff"/>
          </span>
          <input type="file" accept="image/png, image/jpeg" onChange={handleFile}/>
         
              {avatarUrl &&(
                 <img
                    className={styles.preview}
                    src={avatarUrl}
                    alt="Foto do Produto"
                    width={250}
                    height={250}
                 />
             )}
          
        </label>
        <select value={categorySelected} onChange={handleChangeCategory}>
                {categories.map((item,index)=>{
                  return(
                    <option key={item.id} value={index}>
                      {item.name}
                    </option>
                  )
                })
                }
        </select>
         <input
           type="text"
           placeholder="Digite o Nome do Produto"
           className={styles.input}
           value={name}
           onChange={(e)=>setName(e.target.value)}
          />
          <input
           type="text"
           placeholder="Digite o Valor da Produto"
           className={styles.input}
           value={price}
           onChange={(e)=>setprice(e.target.value)}
          />
          <textarea
           placeholder="Descreva seu  Produto"
           className={styles.input}
           value={description}
           onChange={(e)=>setDescription(e.target.value)}
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
 export const getServerSideProps=canSSRAuth(async(contexto)=>{
    //Aula #113-buscar categorias
    const apiClient = setupAPIClient(contexto);
    const response = await apiClient.get('/listcategory');
    /**
     *  ===antes da versao #113 
     * console.log(response.data);
     * return {
     *    props:{}
     * } 
     */
    // 
     return {
        props:{
          categoryList:response.data
        }
     }
          
   })