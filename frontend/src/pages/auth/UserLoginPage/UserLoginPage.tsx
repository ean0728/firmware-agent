import { useNavigate } from 'react-router-dom';
import { LoginLayout } from '../../../components/layout/LoginLayout';
import { Button, Input } from '../../../components/ui';

export function UserLoginPage() {
  const navigate = useNavigate();

  return (
    <LoginLayout
      brandTitle={'进入你的\n企业协作空间。'}
      brandSubtitle="查看所属组织、部门与项目关系，并接收与账号相关的治理通知。"
      brandFooter="账号由平台管理员统一创建"
      formTitle="登录"
      formSubtitle="使用管理员提供的用户名和密码"
      formFooter="没有注册、找回密码或自助改密入口"
      formHint="如无法登录，请联系平台管理员处理账号状态。"
    >
      <Input label="用户名" placeholder="linyu" defaultValue="linyu" />
      <Input label="密码" type="password" placeholder="••••••••" />
      <Button fullWidth onClick={() => navigate('/user/overview')}>
        登录
      </Button>
    </LoginLayout>
  );
}
