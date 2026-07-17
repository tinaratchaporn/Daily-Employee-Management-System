*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}           https://open.spotify.com/
${EMAIL}         Hellotestspotify@gmail.com
${PASSWORD}      Hellotestspotify11
${SONG_NAME}     The Two  Of Us shade

*** Test Cases ***
ล็อกอินและค้นหาเพลงบน Spotify
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Sleep    4s

    # คลิกปุ่ม Login
    Wait Until Element Is Visible    //*[@id="global-nav-bar"]/div[3]/div/div[2]/button[2]/span    10s
    Sleep    4s
    Click Element    //*[@id="global-nav-bar"]/div[3]/div/div[2]/button[2]/span

    # กรอก Email
    Wait Until Element Is Visible    //*[@id="login-username"]    10s
    Sleep    4s
    Input Text    //*[@id="login-username"]    ${EMAIL}

    # กดปุ่ม Continue
    Wait Until Element Is Enabled    //*[@id="login-button"]/span[1]    10s
    Sleep    4s
    Click Element    //*[@id="login-button"]/span[1]

    # คลิกปุ่ม Continue to password
    Wait Until Element Is Visible    //*[@id="encore-web-main-content"]/div/div/div/div/form/div[2]/section/button    10s
    Sleep    4s
    Click Element    //*[@id="encore-web-main-content"]/div/div/div/div/form/div[2]/section/button

    # กรอกรหัสผ่าน
    Wait Until Element Is Visible    //*[@id="login-password"]    10s
    Sleep    4s
    Input Text    //*[@id="login-password"]    ${PASSWORD}

    # คลิกปุ่ม Login
    Wait Until Element Is Enabled    //*[@id="login-button"]/span[1]    10s
    Sleep    4s
    Click Element    //*[@id="login-button"]/span[1]

    # รอให้หน้าโหลดหลังล็อกอิน
    Wait Until Page Contains Element    //*[@id="main"]    15s
    Sleep    4s

    # กดช่องค้นหาและพิมพ์ชื่อเพลง
    Wait Until Element Is Visible    //*[@id="global-nav-bar"]/div[2]/div/div/span/div/form/div[2]/input    10s
    Sleep    4s
    Input Text    //*[@id="global-nav-bar"]/div[2]/div/div/span/div/form/div[2]/input    ${SONG_NAME}
    Press Keys    //*[@id="global-nav-bar"]/div[2]/div/div/span/div/form/div[2]/input    RETURN
    Sleep    4s

    # คลิกเพลงจากผลลัพธ์
    Wait Until Element Is Visible    //*[@id="searchPage"]/div/div/section[1]/div[2]/div/div/div/div[4]    10s
    Sleep    4s
    Click Element    //*[@id="searchPage"]/div/div/section[1]/div[2]/div/div/div/div[4]

    Sleep    5s
    Capture Page Screenshot
    Close Browser
