import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  InputGroup,
  InputWrapper,
  Input,
  Label,
  ClearIcon,
  TogglePasswordIcon,
  RememberMe,
  LoginButton,
  ErrorMessage
} from './loginStyle';

const EmailLogin = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onChange' });

  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const email = watch('memberEmail');
  const password = watch('memberPassword');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  const onSubmit = async ({ memberEmail, memberPassword }) => {
    const MemberVO = { memberEmail, memberPassword };

    try {
      const res = await fetch('http://localhost:10000/members/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(MemberVO),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      const { jwtToken } = data;

      if (rememberMe) {
        localStorage.setItem('jwtToken', jwtToken);
      } else {
        sessionStorage.setItem('jwtToken', jwtToken);
      }

      navigate('/main');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 이메일 입력 */}
      <InputGroup>
        <InputWrapper>
          <Input
            type="email"
            id="email"
            className={email ? 'filled' : ''}
            {...register('memberEmail', {
              required: '이메일을 입력하세요',
              pattern: {
                value: emailRegex,
                message: '이메일 양식에 맞게 입력해주세요',
              },
            })}
          />
          <Label htmlFor="email">이메일</Label>
          <ClearIcon
            src="/assets/images/member/login-input-cancel-icon.png"
            alt="입력 취소"
            onClick={() => setValue('memberEmail', '')}
          />
        </InputWrapper>
        <ErrorMessage show={!!errors.memberEmail}>
          {errors.memberEmail?.message || '⠀'}
        </ErrorMessage>
      </InputGroup>

      {/* 비밀번호 입력 */}
      <InputGroup>
        <InputWrapper>
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={password ? 'filled' : ''}
            {...register('memberPassword', {
              required: '비밀번호를 입력하세요',
              pattern: {
                value: passwordRegex,
                message: '소문자, 숫자, 특수문자 포함 8자 이상',
              },
            })}
          />
          <Label htmlFor="password">비밀번호</Label>
          <ClearIcon
            src="/assets/images/member/login-input-cancel-icon.png"
            alt="입력 취소"
            onClick={() => setValue('memberPassword', '')}
          />
          <TogglePasswordIcon
            src={
              showPassword
                ? '/assets/images/member/see-password-icon-true.png'
                : '/assets/images/member/see-password-icon-false.png'
            }
            alt="비밀번호 보기"
            onClick={() => setShowPassword(prev => !prev)}
          />
        </InputWrapper>
        <ErrorMessage show={!!errors.memberPassword}>
          {errors.memberPassword?.message || '⠀'}
        </ErrorMessage>
      </InputGroup>

      {/* 로그인 상태 유지 */}
      <RememberMe>
        <img
          src={
            rememberMe
              ? '/assets/images/member/checkbox-icon-true.png'
              : '/assets/images/member/checkbox-icon-false.png'
          }
          alt="로그인 상태 유지"
          onClick={() => setRememberMe(prev => !prev)}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
        <span onClick={() => setRememberMe(prev => !prev)}>로그인 상태 유지</span>
      </RememberMe>

      {/* 로그인 버튼 */}
      <LoginButton type="submit" className={email && password ? 'active' : ''} disabled={isSubmitting}>
        로그인
      </LoginButton>
    </form>
  );
};

export default EmailLogin;
