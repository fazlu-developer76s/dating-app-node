
export const successResponse = (status: string, data: any, message: string = 'Success', token?: string) => {
    let records = { status, data, message, token }
    return records
}

export const errorResponse = (status: string, error: any, message: string = 'Error occurred') => {
    let records = { status, message, error: error instanceof Error ? error.message : error }
    return records;
}
