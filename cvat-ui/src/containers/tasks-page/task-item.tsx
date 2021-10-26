// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';

import { TasksQuery, CombinedState, ActiveInference } from 'reducers/interfaces';

import TaskItemComponent from 'components/tasks-page/task-item';

import { getTasksAsync } from 'actions/tasks-actions';
import { cancelInferenceAsync } from 'actions/models-actions';

interface StateToProps {
    deleted: boolean;
    hidden: boolean;
    previewImage: string;
    taskInstance: any;
    activeInference: ActiveInference | null;
    index : any;
}

interface DispatchToProps {
    getTasks(query: TasksQuery): void;
    cancelAutoAnnotation(): void;
}

interface OwnProps {
    idx: number;
    taskID: number;
}

/*
    작성자 : minguin
    날짜 : 2021.10.13
    코멘트 : task index 전달
    추가된 코드 : (#51) index: own.idx
*/

function mapStateToProps(state: CombinedState, own: OwnProps): StateToProps {
    const task = state.tasks.current[own.idx];
    const { deletes } = state.tasks.activities;
    const id = own.taskID;

    window.localStorage.setItem(`${id}_item`, task.instance.name);

    return {
        hidden: state.tasks.hideEmpty && task.instance.jobs.length === 0,
        deleted: id in deletes ? deletes[id] === true : false,
        previewImage: task.preview,
        taskInstance: task.instance,
        activeInference: state.models.inferences[id] || null,
        index: own.idx,
    };
}

function mapDispatchToProps(dispatch: any, own: OwnProps): DispatchToProps {
    return {
        getTasks(query: TasksQuery): void {
            dispatch(getTasksAsync(query));
        },
        cancelAutoAnnotation(): void {
            dispatch(cancelInferenceAsync(own.taskID));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskItemComponent);