import styled from "styled-components";
import { blackColor, fontSizeH6, fontSizeH7, fontSizeH8, fontSizeH9, fontWeightBold, fontWeightRegular, fontWeightThin, gray2Color, gray4Color, gray6Color, mainGreenColor, pointRedColor, subBlueColor, whiteColor } from "../../../globals/common";

const S = {};

S.MainContainer = styled.div`
`

S.TitleContainer = styled.div`
    height: 70px;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.PALLETE.black};
    ${fontSizeH8}
    ${fontWeightThin}
`

S.TitleTopContainer = styled.div`
    display: flex;
    justify-content: left;
`

S.TitleBottomContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    ${fontSizeH6}
    ${blackColor}
`

S.TitleTopLinkText = styled.div`
    ${gray6Color}
    ${fontSizeH8}

    &:hover {
        ${mainGreenColor}
    }
    
`

S.TreeContainer = styled.div`
    width: 100px;
    height: 600px;
    margin-top: 35px;
`

S.GuestBookTitleContainer = styled.div`
    display: flex;
    justify-content: left;
    margin-top: 80px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${({ theme }) => theme.PALLETE.black};
`

S.GuestBookTitle = styled.div`
    padding-right: 10px;
    border-right: 2px solid ${({ theme }) => theme.PALLETE.black};
`

S.GuestBookWriteCount = styled.div`
    padding-left: 10px;
    ${subBlueColor}
`

S.GuestBookInputContainer = styled.div`
`

S.GuestBookInputTitle = styled.div`
    padding: 30px 30px 10px 30px;
`

S.GuestBookInput = styled.textarea`
    font: inherit;
    resize: none;
    outline: none;
    caret-color: auto;
    width: 1118px;
    height: 80px;
    padding: 20px;
    border-radius: 20px;
    ${blackColor}
    ${fontSizeH7}
`
S.GuestBookInputBottomContainer = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    padding-top: 15px;
    ${fontSizeH6}
    ${gray2Color}
`

S.GuestBookInputButton = styled.button`
    text-align: center;
    border: none;
    border-radius: 50px;
    width: 79px;
    height: 43px;
    margin-left: 10px;
    ${whiteColor}
    ${fontSizeH7}
    ${fontWeightBold}
    background-color: ${({ $isActive, theme }) => 
        $isActive ? theme.PALLETE.primary.subBlue : theme.PALLETE.gray.gray3};
        
    cursor: ${({ $isActive }) => $isActive ? 'pointer' : 'default'};

    &:disabled {
        cursor: not-allowed;
    }
`

S.GuestBookInputCount = styled.div`
    padding-right: 5px;
    ${blackColor}
`

S.GuestBookListContainer = styled.div`
    width: 1160px;
    margin-top: 102px;
    border-top: solid 1px ${({ theme }) => theme.PALLETE.black};
`

S.GuestBookItemContainer = styled.div`
    width: 100%;
    border-bottom: solid 1px ${({ theme }) => theme.PALLETE.black};
`

S.GuestBookMemberInfoContainer = styled.div`
    padding: 20px 30px 20px 30px;
    display: flex;
    justify-content: space-between;
`

S.GuestBookMemberInfo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    ${fontSizeH8}
`

S.GuestBookMemberProfileImg = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 36px;
    margin-right: 10px;
`

S.GuestBookDeleteButton = styled.button`
    ${pointRedColor}
    ${fontSizeH7}
    ${fontWeightRegular}
    background: none;
    border: none;
`

S.GuestBookContent = styled.div`
    padding-left: 30px;
    max-width: 800px;
`

S.GuestBookCreateTime = styled.div`
    padding: 20px 30px 20px 30px;
    ${gray4Color}
    ${fontSizeH9}
`

export default S;