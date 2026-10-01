package com.passport.automation.repository;

import com.passport.automation.entity.PassportApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PassportApplicationRepository extends JpaRepository<PassportApplication, Long> {

    Optional<PassportApplication> findFirstByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    List<PassportApplication> findAllByOrderByUpdatedAtDesc();

    @Query("""
           select a from PassportApplication a
           where lower(a.applicationNumber) like :pattern
              or lower(a.fullName) like :pattern
              or lower(a.email) like :pattern
           order by a.updatedAt desc
           """)
    List<PassportApplication> search(@Param("pattern") String pattern);

    @Query("select a.status, count(a) from PassportApplication a group by a.status")
    List<Object[]> countByStatus();
}
