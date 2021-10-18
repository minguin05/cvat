// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import Icon from '@ant-design/icons';
import Dropdown from 'antd/lib/dropdown';
import Progress from 'antd/lib/progress';
import moment from 'moment';
import ExportOnce from 'components/export-once/export-once';

import ActionsMenuContainer from 'containers/actions-menu/actions-menu';
import { ActiveInference } from 'reducers/interfaces';
import { MenuIcon } from 'icons';
import AutomaticAnnotationProgress from './automatic-annotation-progress';

export interface TaskItemProps {
    taskInstance: any;
    previewImage: string;
    deleted: boolean;
    hidden: boolean;
    activeInference: ActiveInference | null;
    cancelAutoAnnotation(): void;
    index: any;
}

class TaskItemComponent extends React.PureComponent<TaskItemProps & RouteComponentProps> {
    private renderPreview(): JSX.Element {
        const { previewImage } = this.props;
        return (
            <Col span={4}>
                <div className='cvat-task-item-preview-wrapper'>
                    <img alt='Preview' className='cvat-task-item-preview' src={previewImage} />
                </div>
            </Col>
        );
    }

    private renderDescription(): JSX.Element {
        // Task info
        const { taskInstance, index } = this.props;
        const { id } = taskInstance;
        const owner = taskInstance.owner ? taskInstance.owner.username : null;
        const updated = moment(taskInstance.updatedDate).fromNow();
        const created = moment(taskInstance.createdDate).format('MMMM Do YYYY');

        console.log(index);
        // Get and truncate a task name
        const name = `${taskInstance.name.substring(0, 70)}${taskInstance.name.length > 70 ? '...' : ''}`;

        /*
            작성자 : minguin
            날짜 : 2021.10.13
            코멘트 : export modal로 index, id, task Name 전달하기 위해 코드 추가
            추가된 코드 : <ExportModal dataID={taskInstance.id} dataName={taskInstance.name} idx={index}/>
        */

        return (
            <Col span={10} className='cvat-task-item-description'>
                <Text strong type='secondary' className='cvat-item-task-id'>{`#${id}: `}</Text>
                <Text strong className='cvat-item-task-name'>
                    {name}
                </Text>
                {/* <ExportOnce dataID={taskInstance.id} dataName={taskInstance.name} idx={index} /> */}
                {/* <ExportOnce dataName={taskInstance.name} /> */}
                <br />
                {owner && (
                    <>
                        <Text type='secondary'>{`Created ${owner ? `by ${owner}` : ''} on ${created}`}</Text>
                        <br />
                    </>
                )}
                <Text type='secondary'>{`Last updated ${updated}`}</Text>
            </Col>
        );
    }

    private renderProgress(): JSX.Element {
        const { taskInstance, activeInference, cancelAutoAnnotation } = this.props;
        // Count number of jobs and performed jobs
        const numOfJobs = taskInstance.jobs.length;
        const numOfCompleted = taskInstance.jobs.filter((job: any): boolean => job.status === 'completed').length;

        // Progress appearance depends on number of jobs
        let progressColor = null;
        let progressText = null;
        if (numOfCompleted && numOfCompleted === numOfJobs) {
            progressColor = 'cvat-task-completed-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Completed
                </Text>
            );
        } else if (numOfCompleted) {
            progressColor = 'cvat-task-progress-progress';
            progressText = (
                <Text strong className={progressColor}>
                    In Progress
                </Text>
            );
        } else {
            progressColor = 'cvat-task-pending-progress';
            progressText = (
                <Text strong className={progressColor}>
                    Pending
                </Text>
            );
        }

        const jobsProgress = numOfCompleted / numOfJobs;

        return (
            <Col span={6}>
                <Row justify='space-between' align='top'>
                    <Col>
                        <svg height='8' width='8' className={progressColor}>
                            <circle cx='4' cy='4' r='4' strokeWidth='0' />
                        </svg>
                        {progressText}
                    </Col>
                    <Col>
                        <Text type='secondary'>{`${numOfCompleted} of ${numOfJobs} jobs`}</Text>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Progress
                            className={`${progressColor} cvat-task-progress`}
                            percent={jobsProgress * 100}
                            strokeColor='#1890FF'
                            showInfo={false}
                            strokeWidth={5}
                            size='small'
                        />
                    </Col>
                </Row>
                <AutomaticAnnotationProgress
                    activeInference={activeInference}
                    cancelAutoAnnotation={cancelAutoAnnotation}
                />
            </Col>
        );
    }

    private renderNavigation(): JSX.Element {
        const { taskInstance, history } = this.props;
        const { id } = taskInstance;

        return (
            <Col span={4}>
                <Row justify='end'>
                    <Col>
                        <Button
                            className='cvat-item-open-task-button'
                            type='primary'
                            size='large'
                            ghost
                            href={`/tasks/${id}`}
                            onClick={(e: React.MouseEvent): void => {
                                e.preventDefault();
                                history.push(`/tasks/${id}`);
                            }}
                        >
                            Open
                        </Button>
                    </Col>
                </Row>
                <Row justify='end'>
                    <Col className='cvat-item-open-task-actions'>
                        <Text className='cvat-text-color'>Actions</Text>
                        <Dropdown overlay={<ActionsMenuContainer taskInstance={taskInstance} />}>
                            <Icon className='cvat-menu-icon' component={MenuIcon} />
                        </Dropdown>
                    </Col>
                </Row>
            </Col>
        );
    }

    public render(): JSX.Element {
        const { deleted, hidden } = this.props;

        const style = {};
        if (deleted) {
            (style as any).pointerEvents = 'none';
            (style as any).opacity = 0.5;
        }

        if (hidden) {
            (style as any).display = 'none';
        }

        return (
            <Row className='cvat-tasks-list-item' justify='center' align='top' style={{ ...style }}>
                {this.renderPreview()}
                {this.renderDescription()}
                {this.renderProgress()}
                {this.renderNavigation()}
            </Row>
        );
    }
}

export default withRouter(TaskItemComponent);
