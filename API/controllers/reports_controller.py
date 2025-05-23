from fastapi import HTTPException
from DAO import reports_dao


def get_all_reports():
    reports = reports_dao.get_all_reports()
    if not reports:
        raise HTTPException(status_code=404, detail="No reports found")
    return reports

def delete_report(report_id: int):
    deleted = reports_dao.delete_report(report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Delete failed")
    return {"message": "Report deleted successfully"}


def create_report(user_id: int, subject: str, content: str):
    report_id = reports_dao.submit_report(user_id, subject, content)
    if not report_id:
        raise HTTPException(status_code=400, detail="Report creation failed")
    return {"message": "Report created successfully", "report_id": report_id}