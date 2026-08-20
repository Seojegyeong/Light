<div align="center">

<img width="1280" height=auto alt="main_1" src="https://github.com/user-attachments/assets/b716c4e9-2c1e-4926-a1b7-612f279ce9bd" />

![version](https://img.shields.io/badge/version-0.3.0-blue)
![Claude](https://img.shields.io/badge/Claude-Haiku%204.5-orange)

</div>

<br>
<br>

## ✨ About light

light는 경제 뉴스 기사에서 금융 용어를 자동으로 감지하고 하이라이트하는 Chrome 확장 프로그램입니다.

경제 기사를 읽다 보면 PER, 기준금리, 파생상품 같은 단어가 낯설게 느껴질 때가 있어요.
매번 검색창을 열면 흐름이 끊기고, 그러다 보면 기사 읽기를 포기하게 되죠.

light는 이런 불편을 줄이기 위해 만들어졌어요.
용어에 마우스를 올리는 것만으로 정의와 예시 문장을 바로 확인할 수 있어요.


<br>

## 🧩 Main Features

| 기능 | 설명 |
|---|---|
| **자동 하이라이트** | 기사를 열면 금융 용어를 자동으로 감지해 하이라이트합니다 |
| **툴팁 정의 카드** | 하이라이트된 단어에 마우스를 올리면 용어 정의와 예시 문장이 즉시 표시됩니다 |
| **카테고리 필터** | 주식, 채권, 거시경제, 파생상품, 부동산, 회계 — 원하는 카테고리만 켜고 끌 수 있어요 |
| **색상 설정** | 하이라이트 색상을 6가지 중 선택할 수 있어요 |

<br>

## 🎬 Demo

<div align="center">

[![Watch Demo](https://img.shields.io/badge/▶-Watch%20Demo-red?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/P0sHsM-qLWU)

<sub>▶️ 클릭하면 시연 영상을 볼 수 있습니다</sub>

</div>

<br>

## 🤖 Claude AI 연동

light는 두 가지 모드로 동작합니다.

| 모드 | 동작 | 필요한 것 |
|------|------|-----------|
| **체험 모드** | 내장 용어 사전으로 하이라이트 | 없음 |
| **풀 기능 모드** | Claude AI가 기사 맥락에 맞게 용어를 실시간 추출·설명 | Claude API 키 |

팝업에서 Claude API 키를 입력하면 풀 기능 모드로 전환됩니다.

> API 키와 기사 텍스트는 [light-server](https://github.com/Seojegyeong/Light-Server)를 통해 Claude API로 전달됩니다. 서버에 저장되지 않습니다.

<br>

## 🚀 Install

아래 링크에서 바로 설치하세요.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/oakngefnlimlmgcoadomekojacbminco?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/light/oakngefnlimlmgcoadomekojacbminco)

<br>

## 🔒 Privacy

light는 광고 없이, 수집하는 개인정보 없이 작동합니다.

- **체험 모드**: 기사 텍스트를 포함한 어떤 데이터도 외부로 전송되지 않습니다.
- **풀 기능 모드**: 기사 텍스트와 Claude API 키가 light-server → Claude API로 전달됩니다. 서버에 저장되지 않습니다.

개인정보처리방침: https://seojegyeong.github.io/Light/privacy-policy.html

<br>

## 🛠 Tech Stack

- React 19 + TypeScript
- Vite + CRXJS (Chrome Extension MV3)
- Emotion (Shadow DOM 내 CSS-in-JS)

<br>

<div align="center">
  
<img width="100" height=auto alt="logo" src="https://github.com/user-attachments/assets/77ca518b-231b-43e4-96cd-0e1fde0ab9ef" />
  
<sub>© 2026 light. All rights reserved.</sub>

</div>
