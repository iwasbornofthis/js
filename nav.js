let isNavbarVisible = false; // 네비게이션 바 상태 추적 변수 선언

function toggleNav() {
    let navbar = document.getElementById("myNavbar");
    isNavbarVisible = !isNavbarVisible;

    if (isNavbarVisible) {
        navbar.style.left = "0px"; // 네비게이션 바 보이기
    } else {
        navbar.style.left = "-160px"; // 네비게이션 바 숨기기
    }
}

window.onclick = function (event) {
    let navbar = document.getElementById("myNavbar");
    let hamburger = document.querySelector('.hamburger');

    // 햄버거 버튼이나 그 자식 요소가 클릭되었는지 확인
    if (!event.target.closest('.hamburger') && isNavbarVisible) {
        navbar.style.left = "-160px";
        hamburger.style.left = "10px";
        isNavbarVisible = false;
    }
}