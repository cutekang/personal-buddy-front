import { NavLink, useParams } from 'react-router-dom';
import S from './style';
import { useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import ProfileCard from '../../layout/profile/ProfileCard';
import { ProfileCardContext } from '../../../context/ProfileCardContext';
import FollowerModal from '../../layout/follow/FollowerModal';
import FollowModal from '../../layout/follow/FollowModal';
import { HeaderContext } from '../../../context/HeaderContext';

const MyPageSidebar = () => {

    // 게스트북의 주인의 아이디
    const { id } = useParams();
    // 게스트북의 주인의 아이디(숫자형)
    const ownerId = Number(id);
    // 로그인된 유저정보
    const {currentUser} = useSelector((state) => state.member)
    // 로그인된 유저의 아이디
    const myId = currentUser.id;
    // 오너의 정보
    const [ownerInfo, setOnwerInfo] = useState({});
    // 프로필 카드 상태
    const [showProfileCard, setShowProfileCard] = useState(false);
    // 프로필 카드 콘텍스트
    const { follow, unfollow, toggleFavorite } = useContext(ProfileCardContext);
    // 팔로워 리스트 상태
    const [showFollowerList, setShowFollowerList] = useState(false);
    // 팔로우 리스트 상태
    const [showFollowList, setShowFollowList] = useState(false);
    // 헤더 콘텍스트
    const { setViewChatRoom } = useContext(HeaderContext);


    // 팔로워 리스트를 열고 닫는 함수
    const handleFollowerList = (state) => {
        setShowFollowerList(state)
    }

    // 팔로우 리스트를 열고 닫는 함수
    const handleFollowList = (state) => {
        setShowFollowList(state)
    }

    // 프로필 카드를 열고 닫는 함수
    const handleProfileCard = (state) => {
        setShowProfileCard(state)
    }

    // 마이페이지 사이드바 전용 - 팔로우 / 언팔로우
    const handleFollow = async () => {
        if (ownerInfo.isFollow === 1) {
            unfollow(myId, id)
        } else {
            follow(myId, id)
        }
    }

    //메세지를 시작하는 함수
    const startChatting = async () => {
        const response = await fetch(`http://localhost:10000/chats/api/chat-room/register?memberId=${myId}&secondMemberId=${ownerId}`, {
            method: "POST"
        })
        const data = await response.json()
        console.log(data);
    }
    
    // 현재 마이페이지 오너의 정보를 가져오는 함수
    useEffect(() => {
        const getOwnerInfo = async () => {
            const response = await fetch(`http://localhost:10000/follows/api/profile-card?memberId=${myId}&profileCardMemberId=${id}`)
            const data = await response.json()
            setOnwerInfo(data)
        }
        getOwnerInfo()
    }, [id, myId, follow, unfollow, toggleFavorite])

    // 팔로우 카운트를 변환해주는 함수
    function formatKoreanNumber(num) {
        if (num == null || isNaN(num)) return "0";

        const jo = 1_0000_0000_0000;
        const eog = 1_0000_0000;
        const man = 1_0000;

        if (num >= jo) {
            return (num / jo).toFixed(1).replace(/\.0$/, '') + "조";
        }
        if (num >= eog) {
            return (num / eog).toFixed(1).replace(/\.0$/, '') + "억";
        }
        if (num >= man) {
            return (num / man).toFixed(1).replace(/\.0$/, '') + "만";
        }
        return num.toLocaleString();
    }

    // 멤버 정보가 없으면 null
    if (!ownerInfo) {
        return null;
    }

    return (
        <div>
            {ownerId !== myId ? (
                <div>
                    {/* 다른 유저의 마이페이지 프로필 */}
                    <S.MyPageMemberProfile>
                        <S.MyPageMemberProfileImg 
                            src={`http://localhost:10000/images/profile/${ownerInfo.memberImgName}`}
                            alt='멤버 프로필 이미지'
                            onError={e => {
                                e.target.src = "/assets/images/header/default-member-img.png";
                            }}
                        />
                    </S.MyPageMemberProfile>
                    <S.MyPageMemberInfoContainer>
                        <S.MyPageMemberInfoNickName onClick={() => handleProfileCard(true)}>
                            <span>
                                {ownerInfo.memberNickname}
                            </span>
                        </S.MyPageMemberInfoNickName>
                        {/* 프로필 카드 영역 */}
                        {showProfileCard && (
                            <S.ProfileCardDropdown>
                                <ProfileCard
                                    memberId={myId}
                                    profileCardMemberId={ownerId}
                                    handleProfileCard={showProfileCard}
                                    onCancel={() => handleProfileCard(false)}
                                />
                            </S.ProfileCardDropdown>
                        )}
                        { showProfileCard && (
                            <S.CardBG onClick={() => {handleProfileCard(false)}}/>
                        )}
                        <S.MyPageMemberInfoStatusMessage>
                            <span>
                                {ownerInfo.memberStatusMessage}
                            </span>
                        </S.MyPageMemberInfoStatusMessage>
                        <S.MyPageMemberInfoFollowContainer>
                            <S.MyPageMemberInfoFollow onClick={() => {handleFollowerList(true)}}>
                                <span>팔로워</span>
                                <S.MyPageMemberInfoFollowCount>
                                    <span>{formatKoreanNumber(ownerInfo.followerCount)}</span>
                                </S.MyPageMemberInfoFollowCount>
                            </S.MyPageMemberInfoFollow>
                            <S.MyPageMemberInfoFollow onClick={() => {handleFollowList(true)}}>
                                <span>팔로우</span>
                                <S.MyPageMemberInfoFollowCount>
                                    <span>{formatKoreanNumber(ownerInfo.followingCount)}</span>
                                </S.MyPageMemberInfoFollowCount>
                            </S.MyPageMemberInfoFollow>
                        </S.MyPageMemberInfoFollowContainer>
                    </S.MyPageMemberInfoContainer>  
                    <S.MyPageButtonContainer>
                        <S.FollowBtn 
                            $isFollow={ownerInfo.isFollow}
                            onClick={() => handleFollow()}
                        >
                            팔로우
                        </S.FollowBtn>
                        <S.MessageBtn
                            onClick={() => startChatting()}
                        >
                            메세지
                        </S.MessageBtn>
                    </S.MyPageButtonContainer>
                    <S.MyPageTapContainer>
                        <S.MyPageTitleContainer>
                            <S.MyPageTitle>
                                <S.MyPageTitleIcon>
                                    <img src='/assets/images/mypage/member.png' alt='멤버 아이콘'/>
                                </S.MyPageTitleIcon>
                                <span>마이페이지</span>
                            </S.MyPageTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={""} end>
                                    <span>나의 성장나무</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"achievement"}>
                                    <span>나의 업적</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                        </S.MyPageTitleContainer>
                    </S.MyPageTapContainer>
                    {/* 팔로워 리스트 영역 */}
                    {showFollowerList && (
                        <FollowerModal
                            memberId={myId}
                            profileMemberId={ownerId}
                            handleFollowerList={showFollowerList}
                            onCancel={() => handleFollowerList(false)}
                        />
                    )}
                    {/* 팔로우 리스트 영역 */}
                    {showFollowList && (
                        <FollowModal
                            memberId={myId}
                            profileMemberId={ownerId}
                            handleFollowerList={showFollowerList}
                            onCancel={() => handleFollowList(false)}
                        />
                    )}
                </div>
            ) : (
                <div>
                    {/* 다른 유저의 마이페이지 프로필 */}
                    <S.MyPageMemberProfile>
                        <S.MyPageMemberProfileImg 
                            src={`http://localhost:10000/images/profile/${ownerInfo.memberImgName}`}
                            alt='멤버 프로필 이미지'
                            onError={e => {
                                e.target.src = "/assets/images/header/default-member-img.png";
                            }}
                        />
                    </S.MyPageMemberProfile>
                    <S.MyPageMemberInfoContainer>
                        <S.MyPageMemberInfoNickName onClick={() => handleProfileCard(true)}>
                            <span>{ownerInfo.memberNickname}</span>
                        </S.MyPageMemberInfoNickName>
                            {/* 프로필 카드 영역 */}
                            {showProfileCard && (
                                <S.ProfileCardDropdown>
                                    <ProfileCard
                                        memberId={myId}
                                        profileCardMemberId={ownerId}
                                        handleProfileCard={handleProfileCard}
                                    />
                                </S.ProfileCardDropdown>
                            )}
                            { showProfileCard && (
                                <S.CardBG onClick={() => {handleProfileCard(false)}}/>
                            )}
                        <S.MyPageMemberInfoStatusMessage>
                            <span>{ownerInfo.memberStatusMessage}</span>
                        </S.MyPageMemberInfoStatusMessage>
                        <S.MyPageMemberInfoFollowContainer>
                            <S.MyPageMemberInfoFollow onClick={() => {handleFollowerList(true)}}>
                                <span>팔로워</span>
                                <S.MyPageMemberInfoFollowCount>
                                    <span>{formatKoreanNumber(ownerInfo.followerCount)}</span>
                                </S.MyPageMemberInfoFollowCount>
                            </S.MyPageMemberInfoFollow>
                            <S.MyPageMemberInfoFollow onClick={() => {handleFollowList(true)}}>
                                <span>팔로잉</span>
                                <S.MyPageMemberInfoFollowCount>
                                    <span>{formatKoreanNumber(ownerInfo.followingCount)}</span>
                                </S.MyPageMemberInfoFollowCount>
                            </S.MyPageMemberInfoFollow>
                        </S.MyPageMemberInfoFollowContainer>
                    </S.MyPageMemberInfoContainer>
                    <S.MyPageTapContainer>
                        <S.MyPageTitleContainer>
                            <S.MyPageTitle>
                                <S.MyPageTitleIcon>
                                    <img src='/assets/images/mypage/member.png' alt='멤버 아이콘'/>
                                </S.MyPageTitleIcon>
                                <span>마이페이지</span>
                            </S.MyPageTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={""} end>
                                    <span>나의 성장나무</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"achievement"}>
                                    <span>나의 업적</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                        </S.MyPageTitleContainer>
                    </S.MyPageTapContainer>
                    <S.MyPageTapContainer>
                        <S.MyPageTitleContainer>
                            <S.MyPageTitle>
                                <S.MyPageTitleIcon>
                                    <img src='/assets/images/mypage/members.png' alt='멤버2 아이콘'/>
                                </S.MyPageTitleIcon>
                                <span>커뮤니티</span>
                            </S.MyPageTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"posts"}>
                                    <span>내 게시물</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"comments"}>
                                    <span>내가 쓴 댓글</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                        </S.MyPageTitleContainer>
                    </S.MyPageTapContainer>
                    <S.MyPageTapContainer>
                        <S.MyPageTitleContainer>
                            <S.MyPageTitle>
                                <S.MyPageTitleIcon>
                                    <img src='/assets/images/mypage/member.png' alt='멤버 아이콘'/>
                                </S.MyPageTitleIcon>
                                <span>내 정보</span>
                            </S.MyPageTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"profile-edit"}>
                                    <span>프로필 설정</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"member-edit"}>
                                    <span>계정 설정</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"point-log"}>
                                    <span>포인트 내역</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                            <S.MyPageSubTitle>
                                <NavLink to={"survey-edit"}>
                                    <span>추천 정보 수정</span>
                                </NavLink>
                            </S.MyPageSubTitle>
                        </S.MyPageTitleContainer>
                        {/* 팔로워 리스트 영역 */}
                        {showFollowerList && (
                            <FollowerModal
                                memberId={myId}
                                profileMemberId={ownerId}
                                handleFollowerList={showFollowerList}
                                onCancel={() => handleFollowerList(false)}
                            />
                        )}
                        {/* 팔로우 리스트 영역 */}
                        {showFollowList && (
                            <FollowModal
                                memberId={myId}
                                profileMemberId={ownerId}
                                handleFollowerList={showFollowList}
                                onCancel={() => handleFollowList(false)}
                            />
                        )}
                    </S.MyPageTapContainer>
                </div>
            )}
        </div>
    );
};


export default MyPageSidebar;