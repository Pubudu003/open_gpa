import { useCallback, useState } from "react";
import axiosInstance from "../../lib/axios";

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);

  // --- Filter / Search state ---
  const [courseSearch, setCourseSearch] = useState("");
  const [filterCredits, setFilterCredits] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [filterDegree, setFilterDegree] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, dRes] = await Promise.all([
        axiosInstance.get("/admin/courses"),
        axiosInstance.get("/admin/degrees"),
      ]);
      setCourses(cRes.data.courses || []);
      setDegrees(dRes.data.degrees || []);
      if (cRes.data.courses.length === 0 || dRes.data.degrees.length === 0) {
      }
    } catch (error) {}
  });

  return <div>CoursesTab</div>;
};

export default CoursesTab;
