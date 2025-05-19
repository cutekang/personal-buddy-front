import React, { useEffect, useRef, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import S from './joinInfoStyle';

const JoinInfo = () => {
  const [email, setEmail] = useState('');
  const [mailAuthCode, setMailAuthCode] = useState('');
  const [phoneAuthCode, setPhoneAuthCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailAuthCodeValid, setEmailAuthCodeValid] = useState(null);
  const [phoneAuthCodeValid, setPhoneAuthCodeValid] = useState(null);
  const [isNameValid, setIsNameValid] = useState(null);
  const [isGenderValid, setIsGenderValid] = useState(null);
  const [emailVerifyMessage, setEmailVerifyMessage] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(true);
  const [authTimer, setAuthTimer] = useState(0);
  const [password, setPassword] = useState('');
  const [phoneValidation, setPhoneValidation] = useState(null);
  const [phoneMessage, setPhoneMessage] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [birthValidation, setBirthValidation] = useState(null);
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const timerRef = useRef(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  const [emailMessage, setEmailMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(null);

  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(null);

  const togglePassword = () => setShowPassword(!showPassword);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, name, gender, birth, phone });
  };

  const getNameGenderMessage = () => {
    if (isNameValid === false && isGenderValid === false) {
      return '※ 이름, 성별은 필수 정보입니다.';
    } else if (isNameValid === false) {
      return '※ 이름은 필수 정보입니다.';
    } else if (isGenderValid === false) {
      return '※ 성별은 필수 정보입니다.';
    } else if (isNameValid === true && isGenderValid === true) {
      return '※ 입력 완료';
    }
    return ''; // 초기 상태에는 메시지 숨김
  };

  const handleSendEmailAuth = async () => {
    try {

        const checkUrl = `http://localhost:10000/members/api/email/check?email=${encodeURIComponent(email)}`;
        const duplicateRes = await fetch(checkUrl, {
        method: "GET"
        });

        const isDuplicate = await duplicateRes.json();

        if (duplicateRes.ok && isDuplicate) {
          alert("이미 등록된 이메일입니다.");
          return;
        }


        const response = await fetch("http://localhost:10000/sms/api/sendEmail", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(email)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "이메일 전송 실패");
            return;
        }

        alert(data.message || "이메일 인증번호가 전송되었습니다.");
        setShowAuthInput(true);
        setAuthTimer(180);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setAuthTimer((prev) => {
            if (prev <= 1) {
                clearInterval(timerRef.current);
                return 0;
            }
            return prev - 1;
            });
        }, 1000);
        } catch (error) {
        console.error("이메일 인증 오류:", error);
        alert("네트워크 오류가 발생했습니다.");
        }
    };

  const handleCheckEmailCode = async () => {
        try {
        const response = await fetch("http://localhost:10000/sms/api/verifyCode", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(mailAuthCode)
        });

        const data = await response.json();
        console.log("응답:", data);

        if (data.isFlag) {
            setEmailVerified(true);
            setEmailAuthCodeValid(true);
            setEmailVerifyMessage(data.message || "※ 이메일 인증 완료");
            clearInterval(timerRef.current);
        } else {
            setEmailVerified(false);
            setEmailAuthCodeValid(false);
            setEmailVerifyMessage(data.message || "※ 이메일 인증 실패");
            alert(data.message || "인증번호가 일치하지 않습니다.");
        }
        } catch (error) {
        console.error("인증번호 확인 오류:", error);
        }
    };

    const handleSendPhoneAuth = async () => {
      const checkUrl = `http://localhost:10000/members/api/phone/check?phone=${encodeURIComponent(phone)}`;
      const res = await fetch(checkUrl);
      const data = await res.json();
    
      if (data.exists) {
        alert(data.message || "이미 등록된 번호입니다.");
        setPhoneValidation(false);
        setPhoneMessage("※ 이미 등록된 전화번호입니다.");
        return;
      }
    
      const sendRes = await fetch("http://localhost:10000/sms/api/sendSms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone)
      });
      const sendData = await sendRes.json();
      alert(sendData.message);
      setPhoneValidation(true); // ✅ 성공이면 true
      setPhoneMessage("※ 인증번호가 발송되었습니다.");
      setAuthTimer(180);
    };

    const handleCheckPhoneCode = async () => {
      const res = await fetch("http://localhost:10000/sms/api/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phoneAuthCode)
      });
      const data = await res.json();
      if (data.isFlag) {
        setPhoneAuthCodeValid(true);
        alert("인증 완료!");
        clearInterval(timerRef.current);
      } else {
        setPhoneAuthCodeValid(false);
        alert("인증 실패!");
      }
    };

    const handleChangePhone = (e) => {
      const value = e.target.value;
    
      // 숫자만 허용
      const onlyNumbers = /^[0-9]*$/;
    
      if (!onlyNumbers.test(value)) {
        setPhoneValidation(false);
        setPhoneMessage('※ 숫자만 입력 가능합니다.');
        return;
      }
    
      // 숫자만 입력한 경우
      setPhone(value);
    
      if (value.length >= 10) {
        setPhoneValidation(true);
        setPhoneMessage('※ 올바른 번호 형식입니다.');
      } else {
        setPhoneValidation(null); // gray로 유지
        setPhoneMessage('');
      }
    };

    const formatTimer = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const isFormValid =
      isEmailValid === true &&
      emailAuthCodeValid === true &&
      isPasswordValid === true &&
      isNameValid === true &&
      isGenderValid === true &&
      birth !== '' &&
      phoneValidation === true &&
      phoneAuthCodeValid === true;

      console.log("이메일 유효:", isEmailValid);
      console.log("이메일 인증코드 확인:", emailAuthCodeValid);
      console.log("비밀번호 유효:", isPasswordValid);
      console.log("이름 유효:", isNameValid);
      console.log("성별 유효:", isGenderValid);
      console.log("생일 입력됨:", birth);
      console.log("전화번호 유효성:", phoneValidation);
      console.log("전화 인증코드 확인:", phoneAuthCodeValid);
      console.log("최종 상태:", isFormValid);
  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit}>
        <S.EmailInputWrapper isValid={isEmailValid}>
          <S.Icon src="/assets/images/member/message-icon.png" />
          <S.Input
            type="email"
            placeholder="아이디 (이메일 주소)"
            value={email}
            onChange={(e) => {
            const value = e.target.value;
            setEmail(value);

            if (!emailRegex.test(value)) {
                setEmailMessage('※ 이메일: 5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.');
                setIsEmailValid(false);
            } else {
                setEmailMessage('※ 사용 가능한 이메일입니다.');
                setIsEmailValid(true);
            }
            }}
            ref={emailRef}
            required
        />
          <S.StatusButton type="button" onClick={handleSendEmailAuth}>인증메일 발송</S.StatusButton>
        </S.EmailInputWrapper>
        {emailMessage && (
        <S.FailMessage style={{ color: isEmailValid ? '#01CD74' : 'FF3F3F' }}>
            {emailMessage}
        </S.FailMessage>
        )}

        {showAuthInput && (
            <S.EmailVerifyCodeInputWrapper isValid={emailAuthCodeValid}>
            <S.Icon src="/assets/images/member/send-mail.png" />
            <S.Input
            type="text"
            placeholder="인증번호 6자리 입력"
            value={mailAuthCode}
            onChange={(e) => setMailAuthCode(e.target.value)}
            />
            {authTimer > 0 && (
            <span style={{ marginRight: '10px', fontSize: '14px', color: '#555' }}>
                {formatTimer(authTimer)}
            </span>
            )}
            <S.StatusButton type="button" onClick={handleCheckEmailCode}>확인</S.StatusButton>
        </S.EmailVerifyCodeInputWrapper>
        )}

        {emailVerifyMessage && (
          <S.FailMessage style={{ color: emailVerified ? '#01CD74' : 'FF3F3F' }}>{emailVerifyMessage}</S.FailMessage>
        )}

        <S.InputWrapper isValid={isPasswordValid}>
        <S.Icon src="/assets/images/member/lock-icon.png" />
        <S.Input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
            const value = e.target.value;
            setPassword(value);

            if (value === '') {
                setIsPasswordValid(null); // 아무것도 안 썼으면 gray 유지
                setPasswordMessage('');
            } else if (!passwordRegex.test(value)) {
                setIsPasswordValid(false);
                setPasswordMessage('※ 영소문자, 숫자, 특수문자(!@#) 포함 8자 이상 입력하세요.');
            } else {
                setIsPasswordValid(true);
                setPasswordMessage('※ 사용 가능한 비밀번호입니다.');
            }
            }}
            required
        />
        <S.TogglePassword
            src={`/assets/images/member/see-password-icon-${showPassword ? 'true' : 'false'}.png`}
            onClick={togglePassword}
        />
        </S.InputWrapper>

        {passwordMessage && (
        <S.FailMessage style={{ color: isPasswordValid ? '#01CD74' : 'FF3F3F' }}>
            {passwordMessage}
        </S.FailMessage>
        )}

        <S.NameInputWrapper isValid={isNameValid && isGenderValid}>
          <S.Icon src="/assets/images/member/smile.png" />
          <S.Input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);
              setIsNameValid(value.trim().length > 0);
            }}
            required
          />
          <S.GenderSelect>
            <label>
              <S.HiddenRadio
                type="radio"
                name="gender"
                value="남성"
                checked={gender === '남성'}
                onChange={(e) => {
                  setGender(e.target.value);
                  setIsGenderValid(true);
                }}
              />
              <S.GenderButton active={gender === '남성'}>남성</S.GenderButton>
            </label>
            <label>
              <S.HiddenRadio
                type="radio"
                name="gender"
                value="여성"
                checked={gender === '여성'}
                onChange={(e) => {
                  setGender(e.target.value);
                  setIsGenderValid(true);
                }}
              />
              <S.GenderButton active={gender === '여성'}>여성</S.GenderButton>
            </label>
          </S.GenderSelect>
        </S.NameInputWrapper>

        {(isNameValid !== null || isGenderValid !== null) && (
          <S.FailMessage
            style={{
              color:
                isNameValid && isGenderValid ? '#01CD74' : '#FF3F3F'
            }}
          >
            {getNameGenderMessage()}
          </S.FailMessage>
        )}

        <S.BirthInputWrapper validationState={birthValidation}>
          <S.Icon src="/assets/images/member/calendar-icon.png" />
          <Flatpickr
            options={{ dateFormat: 'Y-m-d' }}
            value={birth}
            onOpen={() => {
              // 사용자 interaction 감지
              setBirthValidation(birth ? true : false);
            }}
            onChange={([date]) => {
              setBirth(date);
              setBirthValidation(date ? true : false);
            }}
            render={({ defaultValue, value, ...props }, ref) => (
              <S.Input {...props} ref={ref} placeholder="생년월일 선택" required />
            )}
          />
        </S.BirthInputWrapper>

        {birthValidation !== null && (
          birthValidation === false ? (
            <S.FailMessage style={{ color: '#FF3F3F' }}>
              ※ 생년월일은 필수 정보입니다.
            </S.FailMessage>
          ) : (
            <S.FailMessage style={{ color: '#01CD74' }}>
              ※ 입력 완료
            </S.FailMessage>
          )
        )}

        <S.PhoneInputWrapper isValid={phoneValidation}>
          <S.Icon src="/assets/images/member/phone-icon.png" />
          <S.Input
            type="tel"
            placeholder="휴대전화번호"
            value={phone}
            onChange={handleChangePhone}
            required
          />
          <S.StatusButton type="button" onClick={handleSendPhoneAuth}>
            인증번호 발송
          </S.StatusButton>
        </S.PhoneInputWrapper>

        {phoneMessage && (
          <S.FailMessage style={{ color: phoneValidation ? '#01CD74' : '#FF3F3F' }}>
            {phoneMessage}
          </S.FailMessage>
        )}

        {showAuthInput && (
            <S.PhoneVerifyCodeInputWrapper isValid={phoneAuthCodeValid}>
            <S.Icon src="/assets/images/member/lock-icon.png" />
            <S.Input
            type="text"
            placeholder="인증번호 6자리 입력"
            value={phoneAuthCode}
            onChange={(e) => setPhoneAuthCode(e.target.value)}
            />
            {authTimer > 0 && (
            <span style={{ marginRight: '10px', fontSize: '14px', color: '#555' }}>
                {formatTimer(authTimer)}
            </span>
            )}
            <S.StatusButton type="button" onClick={handleCheckPhoneCode}>확인</S.StatusButton>
        </S.PhoneVerifyCodeInputWrapper>
        )}

        <S.SubmitButton type="submit" disabled={!isFormValid} className={isFormValid ? 'active' : ''}>가입하기</S.SubmitButton>
      </S.Form>
    </S.Container>
  );
};

export default JoinInfo;
