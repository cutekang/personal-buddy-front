import styled from "styled-components";

const S = {};

S.CalendarWrapper = styled.div`
  width: 840px;
  height: 780px;
  gap: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* 좌측 시간 라벨 배경 */
  .fc-timegrid-slot-label {
    background-color: #eefff8;
    border: none;
  }

  /* 가운데 시간표 배경 */
  .fc-timegrid-body,
  .fc-timegrid-col,
  .fc-timegrid-col-frame,
  .fc-timegrid-slot {
    background-color: #ffffff;
  }

  /* 요일 헤더 제거 */
  .fc-col-header {
    display: none;
  }

  /* 전체 테두리 제거 */
  .fc-scrollgrid,
  .fc-scrollgrid-section,
  .fc-scrollgrid-sync-table,
  .fc-timegrid {
    border: none !important;
  }
  .fc-timegrid-slot-lane {
  border-right: none !important;
}
.fc-scrollgrid {
  border-right: none !important;
}
.fc-scroller,
.fc-scroller-liquid-absolute {
  background: transparent !important;
  overflow-y: overlay !important;
  padding-right: 0 !important;
  margin-right: 0 !important;
}

/* 오른쪽 공간을 만들 수 있는 root-level wrapper 제거 */
.fc-timegrid-body,
.fc-timegrid-body > table,
.fc-scrollgrid {
  width: 100% !important;
  max-width: 100% !important;
  padding-right: 0 !important;
  margin-right: 0 !important;
  background-color: #ffffff !important;
  box-sizing: border-box;
}

/* 그 어떤 border-right도 제거 */
.fc-timegrid-body td,
.fc-scrollgrid,
.fc-scrollgrid td,
.fc-scrollgrid-section {
  border-right: none !important;
}
  /* 시간 구분선 */
  .fc-timegrid-slot {
    border-top: 1px solid #e5e7eb;
  }

  /* 스크롤 기능 유지, 스크롤바 숨기기 */
  .fc-scroller {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .fc-scroller::-webkit-scrollbar {
    display: none;
  }

  /* 스크롤 영역 회색 배경 제거 */
  .fc-scroller,
  .fc-scroller-harness,
  .fc-timegrid-body,
  .fc-timegrid-body > table,
  .fc-timegrid-body > table td:last-child {
    background-color: transparent !important;
  }

  .fc-timegrid-divider {
    display: none !important;
  }

  .fc-timegrid {
    background-color: #ffffff !important;
  }

  /* 현재 시간 선 (초록색) */
  .fc-timegrid-now-indicator-line {
    border-top: 2px solid #01cd74 !important;
  }

  /* 현재 시간 화살표 (← 방향 초록색) */
  .fc-timegrid-now-indicator-arrow {
    border-left: 6px solid #01cd74 !important;
    border-top: 6px solid transparent !important;
    border-bottom: 6px solid transparent !important;
    border-right: none !important;
    margin-top: -6px;
  }

  .fc-event {
    background-color: #01cd74 !important;
    border: none !important;
    color: white !important; /* 텍스트 가독성 위해 흰색 */
  }

  .fc-event {
  margin: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
}
`;

export default S;
