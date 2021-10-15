// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useHistory } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import { DownloadOutlined, PlusOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button';
import Text from 'antd/lib/typography/Text';
import Modal from 'antd/lib/modal';
import Upload from 'antd/lib/upload';
import SearchField from 'components/search-field/search-field';
import { TasksQuery } from 'reducers/interfaces';
import ExportActions from 'actions/export-actions';

interface VisibleTopBarProps {
    onSearch: (query: TasksQuery) => void;
    onFileUpload(file: File): void;
    query: TasksQuery;
    taskImporting: boolean;
}

export default function TopBarComponent(props: VisibleTopBarProps): JSX.Element {
    const {
        query, onSearch, onFileUpload, taskImporting,
    } = props;

    const history = useHistory();

    return (
        <Row className='cvat-tasks-page-top-bar' justify='center' align='middle'>
            <Col md={22} lg={18} xl={16} xxl={14}>
                <Row justify='space-between' align='bottom'>
                    <Col>
                        <Text className='cvat-title'>Tasks</Text>
                        <SearchField instance='task' onSearch={onSearch} query={query} />
                        {/*
                            author : minguin
                            date : 2021.10.07
                            comments : insert button to export task annotaion at the same time
                        */}
                        <Button
                            size='large'
                            // id='cvat-import-task-button'
                            type='primary'
                            disabled={taskImporting}
                            icon={<DownloadOutlined />}
                            onClick={(): void => history.push('/emport')}
                        >
                            Export All Task
                        </Button>
                        <Modal
                            // visible={}
                            // onCancel={onCancel}
                            // onOk={submitMove}
                            isOpen={true},
                            title={(
                                <span>
                                    test
                                </span>
                            )}
                            className='cvat-task-move-modal'
                        />
                    </Col>
                    <Col>
                        <Row gutter={8}>
                            <Col>
                                <Upload
                                    accept='.zip'
                                    multiple={false}
                                    showUploadList={false}
                                    beforeUpload={(file: File): boolean => {
                                        onFileUpload(file);
                                        return false;
                                    }}
                                    className='cvat-import-task'
                                >
                                    <Button
                                        size='large'
                                        id='cvat-import-task-button'
                                        type='primary'
                                        disabled={taskImporting}
                                        icon={<UploadOutlined />}
                                    >
                                        Import Task
                                        {taskImporting && <LoadingOutlined id='cvat-import-task-button-loading' />}
                                    </Button>
                                </Upload>
                            </Col>
                            <Col>
                                <Button
                                    size='large'
                                    id='cvat-create-task-button'
                                    type='primary'
                                    onClick={(): void => history.push('/tasks/create')}
                                    icon={<PlusOutlined />}
                                >
                                    Create new task
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
