import { BASIC_PROFILE_LG, X } from '../../styles/CommonIcons';
import styled from 'styled-components';
import TopUploadNav from '../../components/common/TopNavBar/TopUploadNav';
import { useEffect, useState, useContext } from 'react';
import Loading from '../../components/common/Loading';
import ContentsLayout from '../../components/layout/ContentsLayout/ContentsLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function Upload() {
  const { myTeam } = useContext(UserContext);
  const [imgList, setImgList] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const url = 'https://api.mandarin.weniv.co.kr';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();

  const userProfile = async () => {
    try {
      const req = await fetch(`${url}/user/myinfo`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });
      const res = await req.json();
      setProfile(res.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validText = (e) => {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleImageInput = async (e) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const imageFile = e.target.files;
      if (imageFile.length > 3)
        return alert('이미지는 3개까지 업로드 가능합니다.');
      for (let i = 0; i < imageFile.length; i++) {
        formData.append('image', imageFile[i]);
      }
      console.log(formData);

      const req = await fetch(`${url}/image/uploadfiles`, {
        method: 'POST',
        body: formData,
      });
      const res = await req.json();
      const fileUrl = res.map((img) => url + '/' + img.filename);
      console.log(fileUrl);
      setImgList([...imgList, ...fileUrl]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handlePost = async () => {
    setIsLoading(true);
    try {
      const postData = {
        post: {
          content: text,
          image: imgList.join(', '),
        },
      };
      const req = await fetch(`${url}/post`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (req.status === 200) {
        navigate('/');
      } else {
        throw new Error('업로드 실패');
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const ResizeHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const deleteImg = (e) => {
    const i = findIndex(e.currentTarget.parentNode);
    const list = [...imgList];
    list.splice(i, 1);
    setImgList(list);
  };

  const beforeEdit = async () => {
    try {
      const req = await fetch(`${url}/post/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      });
      const res = await req.json();
      console.log(res);
      setText(res.post.content);
      setImgList(res.post.image ? res.post.image.split(', ') : []);
      setIsValid(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      const postData = {
        post: {
          content: text,
          image: imgList.join(', '),
        },
      };
      const req = await fetch(`${url}/post/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (req.status === 200) {
        navigate('/profile');
      } else {
        throw new Error('수정 실패');
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      beforeEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TopUploadNav
        btnTxt='업로드'
        isValid={isValid}
        event={id ? handleEdit : handlePost}
      />
      <ContentsLayout>
        {isLoading ? (
          <Loading />
        ) : (
          <StyledSection>
            <img
              className='profile-img'
              src={profile ? profile.image : BASIC_PROFILE_LG}
              alt=''
            />
            <textarea
              name=''
              id=''
              placeholder='게시글 입력하기...'
              onChange={(e) => {
                ResizeHeight(e);
                validText(e);
              }}
              value={text}
              rows={1}
              autoFocus
            ></textarea>
            <label htmlFor='profileImg'>
              <svg
                width='50'
                height='50'
                viewBox='0 0 50 50'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='25'
                  cy='25'
                  r='25'
                  fill={
                    myTeam === 'kt'
                      ? 'var(--tertiary-color-kt)'
                      : 'var(--primary-color-' + (myTeam || 'default') + ')'
                  }
                />
                <path
                  d='M33.1667 14.5H16.8333C15.5447 14.5 14.5 15.5447 14.5 16.8333V33.1667C14.5 34.4553 15.5447 35.5 16.8333 35.5H33.1667C34.4553 35.5 35.5 34.4553 35.5 33.1667V16.8333C35.5 15.5447 34.4553 14.5 33.1667 14.5Z'
                  stroke='white'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M20.9167 22.6667C21.8832 22.6667 22.6667 21.8832 22.6667 20.9167C22.6667 19.9502 21.8832 19.1667 20.9167 19.1667C19.9502 19.1667 19.1667 19.9502 19.1667 20.9167C19.1667 21.8832 19.9502 22.6667 20.9167 22.6667Z'
                  stroke='white'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M35.4999 28.5L29.6666 22.6667L16.8333 35.5'
                  stroke='white'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <input
                type='file'
                id='profileImg'
                name='profile-img'
                accept='image/*'
                onChange={handleImageInput}
                multiple
              />
            </label>
            {!!imgList.length && (
              <ul>
                {imgList.map((img, i) => {
                  return (
                    <li key={i}>
                      <img src={img} alt='' />
                      <button
                        className='delete-btn'
                        type='button'
                        onClick={deleteImg}
                      >
                        <img src={X} alt='이미지 삭제하기' />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </StyledSection>
        )}
      </ContentsLayout>
    </>
  );
}

// select에서 사용하는 동일한 함수
const findIndex = (target) => {
  const siblingList = target.parentNode.children;
  for (let i = 0; i < siblingList.length; i++) {
    if (siblingList[i] === target) {
      return i;
    }
  }
};

const StyledSection = styled.section`
  input[type='file'] {
    display: none;
  }

  label {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 16px;
    bottom: 16px;
    cursor: pointer;
  }

  /* reset */
  img {
    height: auto;
    object-fit: cover;
  }
  .profile-img {
    width: 42px;
    height: auto;
    aspect-ratio: 1/1;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
  }
  textarea {
    margin: 12px 0 0 13px;
    width: calc(100% - 55px); // 프사 + 마진 = 55px
    resize: none; // 크기 고정
    font-size: 1.4rem;
    line-height: 1.8rem;
  }
  textarea::placeholder {
    color: var(--gray-300);
  }
  textarea:focus {
    outline: none;
  }
  .uplode-img {
    width: 50px;
    aspect-ratio: 1/1;
    /* 레이아웃 */
  }

  ul {
    margin-top: 16px;
    display: flex;
    overflow-x: scroll;
    margin-left: auto;
    width: calc(100% - 55px); // 프사 + 마진 = 55px
  }
  ul > li:not(:first-child) {
    margin-left: 8px;
  }
  ul > li {
    position: relative;
    flex-grow: 1;
  }
  ul > li > img {
    min-width: 168px;
    aspect-ratio: 304/228;
    /* 임시 */
    box-shadow: inset 0 0 3px black;
    border-radius: 10px;
  }
  .delete-btn > img {
    position: absolute;
    right: 6px;
    top: 6px;
    width: 22px;
    aspect-ratio: 1/1;
  }
`;
