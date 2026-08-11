import { useNavigate } from 'react-router-dom';
import { LoginLayout } from '../../../components/layout/LoginLayout';
import { Button, Input } from '../../../components/ui';

export function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <LoginLayout
      brandTitle={'企业协作，\n从清晰的身份开始。'}
      brandSubtitle="唯一的默认管理员账号负责创建用户、维护组织关系并审阅所有治理事件。"
      brandFooter="USER & ACCESS GOVERNANCE"
      formTitle="管理员登录"
      formSubtitle="使用默认 admin 账号进入治理控制台"
      formFooter="不提供注册、找回密码或自助修改密码"
      formHint="安全提示：首次部署后请通过配置更换默认凭据。"
    >
      <Input label="用户名" placeholder="admin" defaultValue="admin" />
      <Input label="密码" type="password" placeholder="••••••••" defaultValue="admin" />
      <Button fullWidth onClick={() => navigate('/admin/overview')}>
        登录
      </Button>
    </LoginLayout>
  );
}
