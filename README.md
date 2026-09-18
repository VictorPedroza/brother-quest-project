# Brother Quest

## Acesso administrativo

O login administrativo está disponível em `/admin-login.html` e o painel protegido em `/admin.html`.
Para liberar o acesso, a linha do usuário na tabela `profiles` deve ter `id` igual ao `auth.users.id` e `role = "admin"`. Como fallback, `role: "admin"` em `app_metadata` ou `user_metadata` também é aceito. As tabelas e RPCs do projeto devem estar protegidas por políticas RLS adequadas.