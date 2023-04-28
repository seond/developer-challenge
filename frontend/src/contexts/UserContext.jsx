import React, { useState, createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { USERS } from '../users';
import dsLogo from '../assets/ds_logo.png';
import confLogo from '../assets/conf_logo.png';

export const UserContext = createContext();

const StyledStatusContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    padding: 8px 32px;
    width: 100%;
    font-weight: light;
`;

function StatusBar({ name, role, walletAddress }) {
    return (
        <StyledStatusContainer>
            <div>{name}</div>
            <div>{role}</div>
            <div>{walletAddress}</div>
        </StyledStatusContainer>
    );
}

StatusBar.propTypes = {
    name: PropTypes.string,
    role: PropTypes.string,
    walletAddress: PropTypes.string
};

const Backdrop = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(255, 245, 255, 0.95);
`;

const WhoAreYouContainer = styled.div`
    width: 820px;
    padding: 56px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 1px solid #aaa;
    border-radius: 3px;
`;

const LogoWrapper = styled.div`
    margin-bottom: 120px;
    text-align: center;
    img {
        width: 100%;
    }
`;

const MessageWrapper = styled.div`
    margin-bottom: 48px;
    text-align: center;
    color: #444;
    font-size: 18px;
`;

const UserButtonContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
`;

const UserButton = styled.button`
    font-family: "Roboto";
    background-color: #8a5eff;
    border-radius: 4px;
    border: 2px solid transparent;
    padding: 10px 16px;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        background-color: rgba(255, 255, 255, 0);
        border-color: #8a5eff;
        color: #8a5eff;
    }
`;

export function WhoAreYou({ site, children }) {
    // const [user, setUser] = useState(USERS[2]);
    const [user, setUser] = useState();
    const value = useMemo(() => ({ user }), [user]);

    if (!user) {
        return (
            <Backdrop>
                <WhoAreYouContainer>
                    <LogoWrapper>
                        {(!site || site === 'ds') && <img alt="logo" src={dsLogo} />}
                        {site === 'conf' && <img alt="logo" src={confLogo} />}
                    </LogoWrapper>
                    <MessageWrapper>Who are you?</MessageWrapper>
                    <UserButtonContainer>
                        {USERS.filter((userObject) => !!userObject.role).map((userObject) => (
                            <UserButton
                                type="button"
                                variant="text"
                                key={`user-${userObject.walletAddress}`}
                                onClick={() => {
                                    setUser(userObject);
                                }}
                            >
                                {userObject.name} ({userObject.role})
                            </UserButton>
                        ))}
                    </UserButtonContainer>
                </WhoAreYouContainer>
            </Backdrop>
        );
    }

    return (
        <UserContext.Provider value={value}>
            <StatusBar {...user} />
            {children}
        </UserContext.Provider>
    );
}
