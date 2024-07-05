# Executando projeto na máquina

## 1.Crie um ambiente virtual Python

Execute o seguinte comando para criar uma vitualização da versão do Python:

```shell
python -m venv venv
.\venv\Scripts\activate
```

## 2.Instale os pacotes contidos no requirements.txt

Execute o seguinte comando para instalar os pacotes necessários do projeto:

```shell
pip install -r .\requirements.txt
```

## 3.(Opcional) Caso queira atualizar o requirements.txt

Execute o seguinte comando para gerar um requirements.txt atualizado:

```shell
pip freeze > requirements.txt
```

