
<%@ page import="java.sql.*" %>
<%@ include file="../WEB-INF/db.jsp" %>
<%
Statement st=conn.createStatement();
ResultSet rs=st.executeQuery("SELECT data FROM assessments ORDER BY id DESC");

String result="[";
boolean first=true;

while(rs.next()){
 if(!first) result+=",";
 first=false;
 result+=rs.getString("data");
}
result+="]";

out.print(result);
conn.close();
%>
