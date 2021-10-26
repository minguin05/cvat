// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import DownloadOutlined from '@ant-design/icons';
import Notification from 'antd/lib/notification';
import { useDispatch } from 'react-redux';
import { ExportOnceDatasetAsync } from 'actions/export-actions';

/*
    author : minguin
    Date : 2021.10.25
    Comment : Task List를 페이지 단위로 다운로드 받을 수 있도록 하는 기능
*/

function ExportDatasetModalOnce(): JSX.Element {
    const testArray:any[] = [];
    const dispatch = useDispatch();

    // modal창이 켜져있는지, 꺼져 있는지의 여부 판단하는 useState이며, false가 default로 설정
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 모달창이 켜지도록 하는 함수
    const showModal = () => {
        setIsModalVisible(true);
    };

    // 다운로드 받는 함수를 비동기로 호출하고, 다운로드 받고 있다는 알림창 출력
    const handleExport = useCallback(
        (): void => {
            dispatch(
                ExportOnceDatasetAsync(),
            );
            Notification.info({
                message: 'Dataset export started',
                description:
                    'Download will start automaticly as soon as the dataset is ready.',
                className: 'cvat-notification-notice-export-task-start',
            });
        },
        [],
    );

    // 모달창에서 취소 버튼 클릭 시 실행되는 함수
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 클릭 시 다운로드 되는 button 선언
    let button = null;

    // 관리자일 경우에만 실행되어 버튼 표시
    if (window.sessionStorage.getItem('userName') === 'kimsu') {
        button = (
            <Button
                size='large'
                type='primary'
                icon={<DownloadOutlined />}
                onClick={showModal}
            >
                Export Once
            </Button>
        );
    }

    // 로컬 스토리지에 String으로 전체 저장되어 있는 TaskID를 , 기준으로 분리하여 배열로 저장
    const taskID = window.localStorage.getItem('taskID')?.split(',');

    // 로컬 스토리지에 저장되어 있는 타입이 undefined가 아닐 경우에만 실행
    if (typeof taskID !== 'undefined') {
        for (let i = 0; i < taskID.length; i++) {
            testArray.push(window.localStorage.getItem(`${taskID[i]}_item`));
        }
    }

    // 배열에 저장된 값을 각각 하나의 li로 저장하기 위해 실행
    const listItem = testArray.map((instance) =>
        <li>{JSON.stringify(instance)}</li>);

    return (
        <>
            {button}
            <Modal title='Basic Modal' visible={isModalVisible} onOk={handleExport} onCancel={handleCancel}>
                <b>
                    {' '}
                    Total Num:
                    {taskID?.length}
                    {' '}
                </b>
                <p>{listItem}</p>
            </Modal>
        </>
    );
}
export default React.memo(ExportDatasetModalOnce);
