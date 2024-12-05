{
  
  Guia de Instruções:

  Passo 1: Instalação dos frameworks e linguagens necessários:

  Passo 1.1: Instalar o python:
          
            Usuário Windows:
                
                Acessar a url: https://www.python.org/downloads/

                Instalar versão 3.10 ou inferior
                
            Usuário Linux/Mac:

                Abrir o terminal e rodar o comando:
                  
                  sudo apt-get install python3.10

  Passo 1.2: Instalar o pip:

            Usuário Windows:

                Executar este comando no terminal:

                  py -m ensurepip --upgrade

            Usuário Linux/Mac:

              Executar este comando no terminal:
              
                python -m ensurepip --upgrade
              

  Passo 1.3: Instalar o framework Django:

            Usuário Windows:

                Executar o seguinte comando no terminal:

                    py -m pip install Django==4.2.5   
            
            Usuário Linux/Mac:
                
                Executar o seguinte comando no terminal:
                
                    python3 -m pip install Django==4.2.5

            

  Passo 1.4: Instalar Node.js e npm:
  
            Usuário Windows:

                Acessar a url: https://nodejs.org/en/download/package-manager

                Selecionar a versão v20.18.1(LTS)

                Seguir a seguinte linha de comandos no terminal:

                  # installs fnm (Fast Node Manager)
                    
                    winget install Schniz.fnm

                  # configure fnm environment
                    
                    fnm env --use-on-cd | Out-String | Invoke-Expression

                  # download and install Node.js
                    
                    fnm use --install-if-missing 20
                  
                  # verifies the right Node.js version is in the environment
                    
                    node -v # should print `v20.18.1`
                  
                  # verifies the right npm version is in the environment
                    
                    npm -v # should print `10.8.2`

            Usuário Linux:
            
                Acessar a url: https://nodejs.org/en/download/package-manager

                Selecionar a versão v20.18.1(LTS)
                
                Seguir a seguinte linha de comandos no terminal:

                # installs fnm (Fast Node Manager)
                
                  curl -fsSL https://fnm.vercel.app/install | bash

                # activate fnm
                  
                  source ~/.bashrc

                # download and install Node.js
                  
                  fnm use --install-if-missing 20

                # verifies the right Node.js version is in the environment

                  node -v # should print `v20.18.1`

                # verifies the right npm version is in the environment
                
                  npm -v # should print `10.8.2`

            Usuário Mac:

                  Acessar a url: https://nodejs.org/en/download/package-manager

                  Selecionar a versão v20.18.1(LTS)

                  Seguir a seguinte linha de comandos no terminal:

                  # installs fnm (Fast Node Manager)
                  
                    curl -fsSL https://fnm.vercel.app/install | bash

                  # activate fnm
                    
                    source ~/.bashrc

                  # download and install Node.js
                    
                    fnm use --install-if-missing 20

                  # verifies the right Node.js version is in the environment
                    
                    node -v # should print `v20.18.1`

                  # verifies the right npm version is in the environment

                    npm -v # should print `10.8.2`

  Passo 2: Clonar o repositório, acessando a aba Code do Github na pasta que será o diretório da aplicação em sua máquina.
  
  Passo 3: Abrir o diretório do projeto na máquina local.
  
  Passo 4: Abrir um terminal.
  
  Passo 5: Navegar até a pasta frontend.
  
        Executar este comando no terminal:      
  
            cd frontend

  Passo 6: Digitar o seguinte comando na linha de comando do terminal:

            npm i
  
  Passo 7: Digitar o seguinte comando na linha de comando do terminal:
            
            ng serve
  
  Passo 8: Acessar a aplicação por meio da url http://localhost:4200/ em um browser.

  Passo 9: Abrir outro terminal.

  Passo 10: Navegar até a pasta backend/cblxtool através do comando:
            
            cd backend/cblxtool
  
  Passo 11: Executar o seguinte comando no terminal:
          
          Usuário Windows:
          
              py manage.py runserver
          
          Usuário Linux/Mac:
          
              python3 manage.py runserver
  
  Passo 12: Na aplicação acessada por meio da url http://localhost:4200/ clicar no botão "Cadastre-se!" em amarelo.

  Passo 13: Realizar o cadastro no sistema, preenchendo os campos presentes na tela.

  Passo 14: Realizar o login com o email e senha definidos no cadastro.

  Passo 15: Criar um projeto na tela de Projetos.

  Passo 16: Explorar as três etapas do CBL, Engage, Investigate e Act

  Passo 17: Adiconar elementos nas páginas próprias de cada etapa.

}
