import React, { useState, useRef, useEffect, useContext } from "react";
import S from "./style";
import { useScheduleForm } from "../../../../hooks/calendar/useScheduleForm";
import { useLocation, useParams } from "react-router-dom";
import { Calendar } from "@fullcalendar/core/index.js";
import { CalendarContext } from "../../../../context/CalendarContext";

const ScheduleSave = () => {
  const { memberId, calendarId } = useParams();
  const { state } = useContext(CalendarContext);
  const { calendars, colors, categories } = state;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [calendarMembers, setCalendarMembers] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [mainOpen, setMainOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [color, setColor] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [repeat, setRepeat] = useState("");
  const [repeatDropdownOpen, setRepeatDropdownOpen] = useState(false);
  const repeatRef = useRef(null);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const location = useLocation();
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const endTimeRef = useRef(null);
  const timeRef = useRef(null);
  const { start, end } = location.state || {};
  const {
    startDate,
    startTime,
    endDate,
    endTime,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setStartAndEndFromDate,
  } = useScheduleForm();

  const colorRef = useRef(null);
  const memberRef = useRef(null);
  const mainRef = useRef(null);
  const subRef = useRef(null);
  const mainCategories = categories;
  const subCategories = {
    운동: ["헬스", "수영", "등산"],
    공부: ["게임", "음악", "여행"],
    업무: ["회의", "보고", "개발"],
    모임: ["가족모임", "친구모임", "직장모임"],
    여가: ["영화감상", "드라마보기", "산책", "취미활동"],
    식사: ["아침식사", "점심식사", "저녁식사", "간식", "외식"],
    여행: ["국내여행", "해외여행", "당일치기", "캠핑"],
    건강: ["병원방문", "건강검진", "약복용"],
  };

  const repeatOptions = ["없음", "매일", "매주", "선택한 날짜의 요일"];

  const toggleMember = (member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.name === member.name);
      return isSelected
        ? prev.filter((m) => m.name !== member.name)
        : [...prev, member];
    });
  };

  useEffect(() => {
    console.log(calendars);
    const members = [];

    calendars.forEach((calendar) => {
      if (calendar.id === Number(calendarId)) {
        calendar.sharedMemberLists.forEach((member) => {
          members.push({
            name: member.memberName,
            imgPath: member.memberImgPath,
            imgName: member.memberImgName,
          });
        });
      }
    });

    setCalendarMembers(members);
  }, [calendarId, calendars]);

  const saveSchedule = async () => {
    const payload = {
      calendarId: Number(calendarId),
      scheduleColor: color,
      scheduleCreatedDate: new Date().toISOString().replace("Z", "+09:00"),
      scheduleStartDate: `${startDate}T${startTime}:00+09:00`,
      scheduleEndDate: `${endDate}T${endTime}:00+09:00`,
      scheduleTitle: title,
      scheduleContent: content,
      scheduleCategory: mainCategory || null,
      scheduleRepeat: repeat === "없음" ? 0 : 1,
    };
    try{
      const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/schedules/api/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok){
      throw new Error("일정 등록 실패");
    }
    } catch(error){
      console.error("일정 등록 에러", error);
    }
  };

  const getColorName = (code) => {
    const map = {
      "#01CD74": "초록",
      "#4AB3F7": "스카이블루",
      "#F35F8C": "핑크",
      "#B38BDC": "보라",
      "#3FC2C8": "민트",
    };
    return map[code] ?? code;
  };

  const timeOptions = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  useEffect(() => {
    if (start && end) {
      const isoStart =
        typeof start === "string" ? start : new Date(start).toISOString();
      const isoEnd =
        typeof end === "string" ? end : new Date(end).toISOString();
      setStartAndEndFromDate(isoStart, isoEnd);
    }
  }, [start, end]);

  // 외부 클릭 감지 추가
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) {
        setColorDropdownOpen(false);
      }
      if (memberRef.current && !memberRef.current.contains(e.target)) {
        setMemberDropdownOpen(false);
      }
      if (mainRef.current && !mainRef.current.contains(e.target)) {
        setMainOpen(false);
      }
      if (subRef.current && !subRef.current.contains(e.target)) {
        setSubOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(e.target)) {
        setOpenStartTime(false);
      }
      if (endTimeRef.current && !endTimeRef.current.contains(e.target)) {
        setOpenEndTime(false);
      }
      if (repeatRef.current && !repeatRef.current.contains(e.target)) {
        setRepeatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <S.Container>
      <S.TitleInputContainer>
        <S.TitleInput
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </S.TitleInputContainer>

      <S.DateContainer>
        <S.DateSectionGroup>
          <S.DateSection>
            <S.DateTextLabel>시작</S.DateTextLabel>
            <S.DateInputWrapper>
              {/* 날짜 선택 */}
              <S.DateInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              {/* 시간 선택 드롭다운 */}
              <S.TimeDropdownContainer ref={timeRef}>
                <S.TimeBox onClick={() => setOpenStartTime((prev) => !prev)}>
                  {startTime}
                </S.TimeBox>
                {openStartTime && (
                  <S.TimeList>
                    {timeOptions.map((time) => (
                      <S.TimeItem
                        key={time}
                        onClick={() => {
                          setStartTime(time);
                          setOpenStartTime(false);
                        }}
                      >
                        {time}
                      </S.TimeItem>
                    ))}
                  </S.TimeList>
                )}
              </S.TimeDropdownContainer>
            </S.DateInputWrapper>
          </S.DateSection>
          <S.DateSection>
            <S.DateTextLabel>종료</S.DateTextLabel>
            <S.DateInputWrapper>
              {/* 날짜 선택 */}
              <S.DateInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              {/* 시간 선택 드롭다운 */}
              <S.TimeDropdownContainer ref={endTimeRef}>
                <S.TimeBox onClick={() => setOpenEndTime((prev) => !prev)}>
                  {endTime}
                </S.TimeBox>
                {openEndTime && (
                  <S.TimeList>
                    {timeOptions.map((time) => (
                      <S.TimeItem
                        key={time}
                        onClick={() => {
                          setEndTime(time);
                          setOpenEndTime(false);
                        }}
                      >
                        {time}
                      </S.TimeItem>
                    ))}
                  </S.TimeList>
                )}
              </S.TimeDropdownContainer>
            </S.DateInputWrapper>
          </S.DateSection>
        </S.DateSectionGroup>
      </S.DateContainer>

      <S.ContentContainer>
        <S.ContentWrapper>
          <S.ContentFormGroup>
            {/* 색상 드롭다운 */}
            <S.ContentRow>
              색
              <S.MemberDropdownContainer ref={colorRef}>
                <S.MemberSelectBox
                  onClick={() => setColorDropdownOpen((prev) => !prev)}
                >
                  <S.ColorCircle color={color} />
                  {color ? getColorName(color) : "색상 선택"}
                </S.MemberSelectBox>
                {colorDropdownOpen && (
                  <S.MemberDropdownList>
                    {colors.map((c) => (
                      <S.MemberItem
                        key={c}
                        onClick={() => {
                          setColor(c);
                          setColorDropdownOpen(false);
                        }}
                      >
                        <S.MemberWrapper>
                          <S.ColorCircle color={c} />
                          <S.MemberName>{getColorName(c)}</S.MemberName>
                        </S.MemberWrapper>
                        <S.CheckIcon checked={color === c} />
                      </S.MemberItem>
                    ))}
                  </S.MemberDropdownList>
                )}
              </S.MemberDropdownContainer>
            </S.ContentRow>

            {/* 멤버 드롭다운 */}
            <S.ContentRow>
              멤버
              <S.MemberDropdownContainer ref={memberRef}>
                <S.MemberSelectBox
                  onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
                >
                  캘린더 멤버 ({calendarMembers.length})
                </S.MemberSelectBox>
                {memberDropdownOpen && (
                  <S.MemberDropdownList>
                    {calendarMembers.map((m) => (
                      <S.MemberItem
                        key={m.name}
                        onClick={() => toggleMember(m)}
                      >
                        <S.MemberWrapper>
                          <S.ProfileIcon src={m.imgPath} alt={m.name} />
                          <S.MemberName>{m.name}</S.MemberName>
                        </S.MemberWrapper>
                        <S.CheckIcon
                          checked={selectedMembers.some(
                            (s) => s.name === m.name
                          )}
                        />
                      </S.MemberItem>
                    ))}
                  </S.MemberDropdownList>
                )}
              </S.MemberDropdownContainer>
            </S.ContentRow>

            {/* 카테고리 드롭다운 */}
            <S.ContentRow>
              카테고리
              <S.ContentCategoryWrapper>
                <S.CustomDropdownContainer ref={mainRef}>
                  <S.CustomDropdownSelectBox
                    onClick={() => setMainOpen((prev) => !prev)}
                  >
                    {mainCategory || "상위 선택"}
                  </S.CustomDropdownSelectBox>
                  {mainOpen && (
                    <S.CustomDropdownList>
                      {mainCategories.map((item) => (
                        <S.CustomDropdownItem
                          key={item}
                          onClick={() => {
                            setMainCategory(item);
                            setSubCategory("");
                            setMainOpen(false);
                          }}
                        >
                          {item}
                        </S.CustomDropdownItem>
                      ))}
                    </S.CustomDropdownList>
                  )}
                </S.CustomDropdownContainer>

                <S.CustomDropdownContainer ref={subRef}>
                  <S.CustomDropdownSelectBox
                    onClick={() => {
                      if (mainCategory) setSubOpen((prev) => !prev);
                    }}
                    disabled={!mainCategory}
                  >
                    {subCategory || "하위 선택"}
                  </S.CustomDropdownSelectBox>
                  {subOpen && (
                    <S.CustomDropdownList>
                      {subCategories[mainCategory]?.map((item) => (
                        <S.CustomDropdownItem
                          key={`${mainCategory}-${item}`}
                          onClick={() => {
                            setSubCategory(item);
                            setSubOpen(false);
                          }}
                        >
                          {item}
                        </S.CustomDropdownItem>
                      ))}
                    </S.CustomDropdownList>
                  )}
                </S.CustomDropdownContainer>
              </S.ContentCategoryWrapper>
            </S.ContentRow>

            {/* 장소 */}
            <S.ContentRow>
              장소
              <S.ContentRowInput />
            </S.ContentRow>

            {/* 반복 */}
            {/* 반복 */}
            <S.ContentRow>
              반복
              <S.MemberDropdownContainer ref={repeatRef}>
                <S.MemberSelectBox
                  onClick={() => setRepeatDropdownOpen((prev) => !prev)}
                >
                  {repeat || "반복 선택"}
                </S.MemberSelectBox>
                {repeatDropdownOpen && (
                  <S.MemberDropdownList>
                    {repeatOptions.map((option) => (
                      <S.MemberItem
                        key={option}
                        onClick={() => {
                          setRepeat(option);
                          setRepeatDropdownOpen(false);
                        }}
                      >
                        <S.MemberName>{option}</S.MemberName>
                        <S.CheckIcon checked={repeat === option} />
                      </S.MemberItem>
                    ))}
                  </S.MemberDropdownList>
                )}
              </S.MemberDropdownContainer>
            </S.ContentRow>

            {/* 내용 */}
            <S.ContentRowTextArea>
              내용
              <S.ContentRowTextInput
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </S.ContentRowTextArea>
          </S.ContentFormGroup>

          <S.ButtonGroup>
            <S.SaveButton onClick= {saveSchedule}>저장</S.SaveButton>
            <S.CancelButton>취소</S.CancelButton>
          </S.ButtonGroup>
        </S.ContentWrapper>
      </S.ContentContainer>
    </S.Container>
  );
};

export default ScheduleSave;
